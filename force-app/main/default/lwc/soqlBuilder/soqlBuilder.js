import { LightningElement, wire } from "lwc";
import getNameAllObjects from "@salesforce/apex/ObjectManager.getNameAllObjects";
import getNameFieldsOfObject from "@salesforce/apex/ObjectManager.getNameFieldsOfObject";

const sortingOrder = {
  ASC: "ASC",
  DESC: "DESC"
};

export default class Main extends LightningElement {
  @wire(getNameAllObjects) nameAllObjects;
  selectObjName = "";
  selectFieldName = "";
  selectSortingField = "";

  sortingStrategy = [
    { label: "A to Z", value: sortingOrder.ASC },
    { label: "Z to A", value: sortingOrder.DESC }
  ];

  @wire(getNameFieldsOfObject, { objectName: "$selectObjName" })
  nameFields;

  /**
   * @description: Create list objects for lightning-select with props label and value
   */
  get nameObjectsOptions() {
    let result = [];
    if (this.nameAllObjects.data) {
      this.nameAllObjects.data.forEach((element) => {
        let option = { label: element, value: element };
        result.push(option);
      });
      return result;
    }
    return result;
  }

  get fieldsForSorting() {
    let result = [];
    if (this.nameFields.data) {
      this.nameFields.data.forEach((element) => {
        let option = { label: element, value: element };
        result.push(option);
      });
      return result;
    }
    return result;
  }

  get nameFieldsOptions() {
    let result = [];
    if (this.nameFields.data) {
      const countFiled = { label: "count()", value: "count()" };
      result.push(countFiled);
      this.nameFields.data.forEach((element) => {
        let option = { label: element, value: element };
        result.push(option);
      });
      return result;
    }
    return result;
  }

  handleObjName(event) {
    this.selectObjName = event.detail.value;
    this.selectFieldName = "";
  }

  handleFieldName(event) {
    this.selectFieldName = event.detail.value;
    let query = `SELECT ${this.selectFieldName} FROM ${this.selectObjName}`;
    this.template.querySelector("lightning-textarea").value = query;
  }
  handleQueryClick() {
    // let query = `SELECT ${this.selectFieldName} FROM ${this.selectObjName}`;
    // this.template.querySelector("lightning-textarea").value = query;
  }
}
