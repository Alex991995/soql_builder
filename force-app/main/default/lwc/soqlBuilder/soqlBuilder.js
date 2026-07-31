import { LightningElement, wire } from "lwc";
import getNameAllObjects from "@salesforce/apex/ObjectManager.getNameAllObjects";
import getNameFieldsOfObject from "@salesforce/apex/ObjectManager.getNameFieldsOfObject";
import { filteringOptions, filteringOperations } from "c/filteringOperations";

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
      where: this.whereClause,
      operation: this.operationClause,
      input: this.selectFilteringField && this.selectFilterValue,
      orderBy: this.selectSortingField && "ORDER BY " + this.selectSortingField,
      sortStrategy: this.selectSortingField && this.selectSortingStrategy,
      nullQuery: this.selectSortingField && this.selectNull
    };
  }
  /**
  * @description: Shows the whole where clause if the filtering field and input are selected
  */
  get whereClause() {
    return (
      this.selectFilteringField &&
      this.selectFilterValue &&
      "WHERE " + this.selectFilteringField
    );
  }
  /**
   * @description: Shows the operation clause if the filtering field and input are selected
   */
  get operationClause() {
    return (
      this.selectFilteringField &&
      this.selectFilterValue &&
      this.selectFilteringOperation
    );
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

  refreshSoqlQuery() {
    const query = Object.values(this.objQuery)
      .filter((item) => Boolean(item))
      .join(" ");
    this.soqlQuery = query;
  }

  handleSortingField(event) {
    this.selectSortingField = event.detail.value;
    this.refreshSoqlQuery();
  }

  handleFilteringField(event) {
    this.selectFilteringField = event.detail.value;
    this.refreshSoqlQuery();
  }
  handleFilteringOperation(event) {
    this.selectFilteringOperation = event.detail.value;
    this.refreshSoqlQuery();
  }

  handleSortingStrategy(event) {
    this.selectSortingStrategy = event.detail.value;
    this.refreshSoqlQuery();
  }

  handleNull(event) {
    this.selectNull = event.detail.value;
    this.refreshSoqlQuery();
  }

  handleFilterValueChange(event) {
    this.selectFilterValue = event.detail.value;
    this.refreshSoqlQuery();
  }
}