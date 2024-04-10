import { LightningElement,api,wire } from 'lwc';
import fetchLookupData from '@salesforce/apex/customLookupController.fetchLookupData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const DELAY = 300;
export default class MultiCustomLookup extends LightningElement {

    searchKey;
    hasRecords = false;
    searhOutput = [];
    selectedRecords = [];
    error;
    delayTimeout;
    @api objectApiName = "Account";
    @api label = "Account"
    @api palceholder = "Search Account";
    @api iconName = "standard:account";

    
    @wire(fetchLookupData, { searchKey: '$searchKey', objectApiName: '$objectApiName' }) 
        searchResult({data, error}){
            if (data) {
                console.log(data);
                this.hasRecords = data.length > 0 ? true : false;
                this.searhOutput = data;
            }else if(error){
                console.log(error);
            }
        }

        changeHandler(event){
            clearTimeout(this.delayTimeout);
            let value = event.target.value; 
            
           this.delayTimeout = setTimeout(()=>{
                this.searchKey = value;
            }, DELAY);
        }

        clickHandler(event){
            let recId = event.target.getAttribute("data-recid");
            console.log("recordId", recId);
            if (this.validateDuplicate(recId)) {
             let selectedRecord = this.searhOutput.find((currentItem)=>currentItem.Id ===recId);
            let pill = {
            type: 'icon',
            label: selectedRecord.Name,
            name: recId,
            iconName: this.iconName,
            alternativeText: selectedRecord.Name
        };
        this.selectedRecords = [...this.selectedRecords, pill];
            }         
        }

        get showPillContainer(){
             return this.selectedRecords.length > 0 ? true : false;
        }

        handleItemRemove(event){
            const index = event.detail.index;
            this.selectedRecords.splice(index, 1);
        }

        validateDuplicate(selectedRecord){
            let isValid = true;
          let isRecordAlreadySelected = this.selectedRecords.find(currentItem => currentItem.name === selectedRecord);
            if (isRecordAlreadySelected) {
                isValid = false;
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error!',
                    message: 'Pill already selected',
                    variant: 'error',
                }));
            }else{isValid = true;}
            return isValid;
        }

}