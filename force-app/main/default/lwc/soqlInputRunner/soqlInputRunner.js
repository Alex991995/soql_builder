import { api, LightningElement } from "lwc";

export default class SoqlInputRunner extends LightningElement {
  @api valueText = "";
  
  handleQueryClick() {
    // let query = `SELECT ${this.selectFieldName} FROM ${this.selectObjName}`;
    // this.template.querySelector("lightning-textarea").value = query;
  }
}
