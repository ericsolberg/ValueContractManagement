const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    const { ValueContracts, KeyCustomers } = this.entities;

    this.on('performCreditCheck', ValueContracts, async (req) => {
        //const { newStatus, comments } = req.data;
        const contractId = req.params[0].ID || req.params[0];

        // Get the current  record
        const contract = await SELECT.one.from(ValueContracts).where({ ID: contractId });
        if (!contract) {
            req.error(404, 'Value Contract not found');
        }
        console.log(`Performing Prospect Research Agent check for contract ID: ${contractId}`);
        // Implement credit check logic here

        const updated = await UPDATE(ValueContracts).set({ creditStatus: 'Approved' }).where({ ID: contractId })

        console.log(`Prospect Research Agent check performed for contract ID: ${contractId}`);

        //await new Promise(r => setTimeout(r, 5000));

        req.info(`Prospect Research Agent check performed for contract ${contract.contractNumber}`);

    });

    this.on('setCreditPending', ValueContracts, async (req) => {
        //const { newStatus, comments } = req.data;
        const contractId = req.params[0].ID || req.params[0];

        // Get the current  record
        const contract = await SELECT.one.from(ValueContracts).where({ ID: contractId });
        if (!contract) {
            req.error(404, 'Value Contract not found');
        }

                console.log(`Setting credit Pending: ${contractId}`);

    const updated = await UPDATE(ValueContracts).set({ creditStatus: 'Pending' }).where({ ID: contractId })

        req.info(`Set to pending ${contract.contractNumber}`);

    });

    this.on('setCreditUnderReview', ValueContracts, async (req) => {
        //const { newStatus, comments } = req.data;
        const contractId = req.params[0].ID || req.params[0];

        // Get the current  record
        const contract = await SELECT.one.from(ValueContracts).where({ ID: contractId });
        if (!contract) {
            req.error(404, 'Value Contract not found');
        }

        console.log(`Setting credit Under Review: ${contractId}`);

        const updated = await UPDATE(ValueContracts).set({ creditStatus: 'Under Review' }).where({ ID: contractId })

        req.info(`Credit under review ${contract.contractNumber}`);

    });





    this.on('triggerCreditCheck', async (req) => {
        const { contractID } = req.data;
        // Implement credit check logic here
        return `Credit check triggered for contract ${contractID}`;
    });

    this.on('updateCreditStatus', async (req) => {
        const { contractID, status, findings } = req.data;
        // Implement credit status update logic here
        return `Credit status updated for contract ${contractID}`;
    });

    this.on('getContractsByCustomer', async (req) => {
        const { customerID } = req.data;
        return await SELECT.from(ValueContracts).where({ customer_ID: customerID });
    });

    this.on('getCustomerRiskSummary', async (req) => {
        const { customerID } = req.data;
        const contracts = await SELECT.from(ValueContracts).where({ customer_ID: customerID });
        const totalContracts = contracts.length;
        const totalValue = contracts.reduce((sum, contract) => sum + contract.contractValue, 0);

        let riskCategory = 'Low';
        if (totalValue > 2000000) riskCategory = 'High';
        else if (totalValue > 1000000) riskCategory = 'Medium';

        const activeContracts = contracts.filter(contract => contract.status === 'Active');
        const creditStatus = activeContracts.every(contract => contract.creditStatus === 'Approved') ? 'Good' : 'Under Review';

        return {
            totalContracts,
            totalValue,
            riskCategory,
            creditStatus
        };
    });

    this.on('fetchS4HANASalesContracts', async () => {
        try {
            console.log('Attempting to fetch S4HANA sales contracts...');
            console.log('S4HANAService:', S4HANAService);
            console.log('S4HANAService methods:', Object.getOwnPropertyNames(S4HANAService));
            console.log('S4HANAService entities:', S4HANAService.entities);

            if (!S4HANAService.entities || !S4HANAService.entities.SalesContracts) {
                throw new Error('S4HANAService.entities.SalesContracts is undefined');
            }

            console.log('Calling fetchSalesContracts...');
            const salesContracts = await S4HANAService.fetchSalesContracts();
            console.log('Fetched sales contracts:', salesContracts);

            return salesContracts.map(contract => ({
                ID: contract.ID,
                contractId: contract.contractId,
                customerId: contract.customerId,
                totalAmount: contract.totalAmount,
                status: contract.status
            }));
        } catch (error) {
            console.error('Error fetching S/4HANA sales contracts:', error);
            throw new Error(`Failed to fetch S/4HANA sales contracts: ${error.message}`);
        }
    });

    this.on('syncSalesContracts', async () => {
        try {
            const salesContracts = await this.fetchS4HANASalesContracts();

            for (const contract of salesContracts) {
                // Check if the customer exists, if not, create a new one
                let customer = await SELECT.one.from(KeyCustomers).where({ customerID: contract.customerId });
                if (!customer) {
                    customer = await INSERT.into(KeyCustomers).entries({ customerID: contract.customerId });
                }

                // Create or update the ValueContract
                await UPSERT.into(ValueContracts).entries({
                    contractID: contract.contractId,
                    customer_ID: customer.ID,
                    totalAmount: contract.totalAmount,
                    status: contract.status
                });
            }

            return `Synchronized ${salesContracts.length} contracts from S/4HANA`;
        } catch (error) {
            console.error('Error syncing S/4HANA sales contracts:', error);
            throw new Error('Failed to sync S/4HANA sales contracts');
        }
    });
});
