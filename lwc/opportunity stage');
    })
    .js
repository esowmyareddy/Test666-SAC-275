import { LightningElement, wire, track } from 'lwc';
import { getRecord, getFieldValue, updateRecord } from 'lightning/uiRecordApi';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';
import ID_FIELD from '@salesforce/schema/Opportunity.Id';
import ACCOUNT_ID_FIELD from '@salesforce/schema/Opportunity.AccountId';
import CREATED_DATE_FIELD from '@salesforce/schema/Opportunity.CreatedDate';
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import CLOSED_LOST_VALUE from '@salesforce/label/c.Closed_Lost';

export default class UpdateOpportunitiesOnAccountUpdate extends LightningElement {
  @wire(getRecord, { recordId: '$opportunityId', fields: [ID_FIELD, ACCOUNT_ID_FIELD, CREATED_DATE_FIELD, STAGE_FIELD]}) 
  opportunity;

  get opportunityId() {
    return this.opportunity.data.fields.Id.value;
  }

  get accountId() {
    return this.opportunity.data.fields.AccountId.value;
  }

  get createdDate() {
    return this.opportunity.data.fields.CreatedDate.value;
  }

  get stage() {
    return this.opportunity.data.fields.StageName.value;
  }

  updateOpportunity() {
    // Identify all opportunities related to an account when the account is updated
    const opportunities = getOpportunitiesByAccountId(this.accountId);

    // For each opportunity identified, check if its created date is greater than 30 days from today
    opportunities.forEach(opportunityId => {
      const createdDate = getCreatedDate(opportunityId);
      const isCreatedDateGreaterThan30Days = isDateGreaterThan30Days(createdDate);

      if (isCreatedDateGreaterThan30Days) {
        // If an opportunity's created date is greater than 30 days from today and its stage is not Close Won, update the opportunity's stage to Close Lost
        const stage = getStage(opportunityId);
        if (stage !== CLOSED_LOST_VALUE) {
          updateOpportunityStage(opportunityId, CLOSED_LOST_VALUE);
        }
      }
    });
  }

  getOpportunitiesByAccountId(accountId) {
    // TODO: Implement logic to get all opportunities related to an account
  }

  getCreatedDate(opportunityId) {
    // TODO: Implement logic to get created date of an opportunity
  }

  isDateGreaterThan30Days(date) {
    // TODO: Implement logic to check if date is greater than 30 days from today
  }

  getStage(opportunityId) {
    // TODO: Implement logic to get stage of an opportunity
  }

  updateOpportunityStage(opportunityId, stage) {
    const fields = {};
    fields[ID_FIELD.fieldApiName] = opportunityId;
    fields[STAGE_FIELD.fieldApiName] = stage;
    const recordInput = {fields};

    // Log all changes made to opportunities' stages in the system
    console.log('Updating opportunity stage to: ' + stage);

    updateRecord(recordInput)
      .then(() => {
        console.log('Successfully updated