import { LightningElement, wire } from "lwc";
import getNameAllObjects from "@salesforce/apex/ObjectManager.getNameAllObjects";
import getNameFieldsOfObject from "@salesforce/apex/ObjectManager.getNameFieldsOfObject";
import { filteringOptions, filteringOperations } from "c/filtering_operations";

const sortingOrder = {
  ASC: "ASC",
  DESC: "DESC"
};

const sortingStrategy = [
  { label: "A to Z", value: sortingOrder.ASC },
  { label: "Z to A", value: sortingOrder.DESC }
];

const nullOptions = [
  { label: "Nulls First", value: "NULLS FIRST" },
  { label: "Nulls Last", value: "NULLS LAST" }
];

export default class SoqlBuilder extends LightningElement {
  @wire(getNameAllObjects) nameAllObjects;
  @wire(getNameFieldsOfObject, { objectName: "$selectObjName" })
  nameFields;
  soqlQuery = "";

  selectObjName = "";
  selectFieldName = "";
  selectSortingField = "";
  selectFilteringField = "";
  selectFilteringOperation = filteringOperations.equal;
  selectFilterValue = "";
  selectNull = nullOptions[0].value;
  selectSortingStrategy = sortingOrder.ASC;

  filteringOperations = filteringOptions;
  sortingStrategy = sortingStrategy;
  nullOptions = nullOptions;

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
      const emptyOption = { label: "", value: "" };
      result.push(emptyOption);
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

  /**
   * @description: If a field name is selected, the select element should be disabled
   */
  get isFieldNameSelected() {
    const isSelected = Boolean(this.selectFieldName);
    return !isSelected;
  }

  /**
   * @description: If a field name is selected, the select element should be disabled
   */
  get isFilteringFieldSelected() {
    const isSelected = Boolean(this.selectFilteringField);
    return !isSelected;
  }

  get objQuery() {
    return {
      select: `SELECT ${this.selectFieldName}`,
      from: `FROM ${this.selectObjName}`,
      where: this.selectFilteringField && this.selectFilterValue && 'WHERE ' + this.selectFilteringField,
      operation: this.selectFilteringField && this.selectFilterValue && this.selectFilteringOperation,
      input: this.selectFilteringField && this.selectFilterValue,
      orderBy: this.selectSortingField && 'ORDER BY ' + this.selectSortingField,
      sortStrategy: this.selectSortingField && this.selectSortingStrategy,
      nullQuery: this.selectSortingField && this.selectNull
    };
  }

  renderedCallback() {
    console.log("objQuery", Object.values( this.objQuery));

    console.log("selectObjName", this.selectObjName);
    console.log("selectFieldName", this.selectFieldName);
    console.log("selectSortingField", this.selectSortingField);
    console.log("selectFilteringField", this.selectFilteringField);
    console.log("selectFilteringOperation", this.selectFilteringOperation);
    console.log("selectFilterValue", this.selectFilterValue);
  }

  /**
   * @description: Select an Object and reset the selected field and query
   */
  handleObjName(event) {
    this.selectObjName = event.detail.value;
    this.selectFieldName = "";
    this.soqlQuery = "";
  }

  /**
   * @description: Select a field and insert it into the query
   */
  handleFieldName(event) {
    this.selectFieldName = event.detail.value;
    const { select, from } = this.objQuery;
    this.soqlQuery = `${select} ${from}`;
  }

  handleSortingField(event) {
    this.selectSortingField = event.detail.value;
    const { select, from, where, operation, input} = this.objQuery;
    const firstPartQuery = `${select} ${from} ${this.selectFilteringField && where + ' ' + operation + ' ' + input}`;

    if (!this.selectSortingField) {
      this.soqlQuery = firstPartQuery;
      return;
    }
    const query = Object.values(this.objQuery).filter(item => Boolean(item)).join(" ");
    this.soqlQuery = query;
  }

  // handleQueryClick() {
  // let query = `SELECT ${this.selectFieldName} FROM ${this.selectObjName}`;
  // this.template.querySelector("lightning-textarea").value = query;
  // }
  handleFilteringField(event) {
    this.selectFilteringField = event.detail.value;
    const query = Object.values(this.objQuery).filter(item => Boolean(item)).join(" ");
    this.soqlQuery = query;
  }
  handleFilteringOperation(event) {
    this.selectFilteringOperation = event.detail.value;
    const isWhere = this.soqlQuery.includes("WHERE");
    if (isWhere) {
      const query = Object.values(this.objQuery).join(" ");
      this.soqlQuery = query;
    }
  }

  handleSortingStrategy(event) {
    this.selectSortingStrategy = event.detail.value;
    const isOrderBy = this.soqlQuery.includes("ORDER BY");

    if (isOrderBy) {
      const query = Object.values(this.objQuery).filter(item => Boolean(item)).join(" ");
      this.soqlQuery = query;
    }
  }

  handleNull(event) {
    this.selectNull = event.detail.value;
    let query = '';
    const { select, from, orderBy, sortStrategy, input, nullQuery } = this.objQuery;
    if (!input) {
      query = `${select} ${from} ${orderBy} ${sortStrategy} ${nullQuery}`;
      this.soqlQuery = query;
      console.log("input!", query);
      return;
    }
    query = Object.values(this.objQuery).join(" ");
    this.soqlQuery = query;
  }
  
  handleFilterValueChange(event) {
    this.selectFilterValue = event.detail.value;
    const query = Object.values(this.objQuery).filter(item => Boolean(item)).join(" ");
    this.soqlQuery = query;
  }
}