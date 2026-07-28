import { LightningElement, wire } from "lwc";
import getNameAllObjects from "@salesforce/apex/ObjectManager.getNameAllObjects";
import getNameFieldsOfObject from "@salesforce/apex/ObjectManager.getNameFieldsOfObject";
import { filteringOptions } from "c/filtering_operations";

const sortingOrder = {
  ASC: "ASC",
  DESC: "DESC"
};

export default class SoqlBuilder extends LightningElement {
  @wire(getNameAllObjects) nameAllObjects;
  // objQuery = {
  //   select: "",
  //   from: "",
  //   where: "",
  //   orderBy: ""
  // };
  selectObjName = "";
  selectFieldName = "";
  selectSortingField = "";
  selectFilteringOperation = "";
  filteringOperations = filteringOptions;

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
    //  this.template.querySelector("lightning-textarea").value = this.query;
  }
  handleSortingField(event) {
    this.selectSortingField = event.detail.value;
    let query = `SELECT ${this.selectFieldName} FROM ${this.selectObjName} ORDER BY ${this.selectSortingField}`;
    this.template.querySelector("lightning-textarea").value = query;
  }
  handleQueryClick() {
    // let query = `SELECT ${this.selectFieldName} FROM ${this.selectObjName}`;
    // this.template.querySelector("lightning-textarea").value = query;
  }
  handleFilteringField(event) {
    this.selectFilteringField = event.detail.value;
  }
  handleFilteringOperation(event) {
    this.selectFilteringOperation = event.detail.value;
  }

  handleFilterValueChange(event) {
    this.selectFilterValue = event.detail.value;
    let query = "";
    // let query = `
    const SELECT = "SELECT " + this.selectFieldName;
    const FROM = "FROM " + this.selectObjName;
    const WHERE =
      "WHERE " +
      this.selectFilteringField +
      " " +
      this.selectFilteringOperation +
      " " +
      this.selectFilterValue;

    if (!this.selectFilterValue) {
      query = `${SELECT} ${FROM}`;
    } else {
      query = `${SELECT} ${FROM} ${WHERE}`;
    }

    this.template.querySelector("lightning-textarea").value = query;
  }
}
