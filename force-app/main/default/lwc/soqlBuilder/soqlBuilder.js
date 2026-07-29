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

  soqlQuery = "";
  // isFieldNameSelected = !!this.selectFieldName;

  isDisabled = true;

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
      where: `WHERE ${this.selectFilteringField}`,
      operation: this.selectFilteringOperation,
      input: this.selectFilterValue,
      orderBy: `ORDER BY ${this.selectSortingField}`,
      sortStrategy: `${this.selectSortingStrategy}`,
      nullQuery: `${this.selectNull}`
    };
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
    const { select, from, orderBy, sortStrategy, nullQuery } = this.objQuery;
    const firstPartQuery = `${select} ${from}`;

    if (!this.selectSortingField) {
      this.soqlQuery = firstPartQuery;
      return;
    }
    const query = `${firstPartQuery} ${orderBy} ${sortStrategy} ${nullQuery}`;
    this.soqlQuery = query;
  }
    
  // handleQueryClick() {
  // let query = `SELECT ${this.selectFieldName} FROM ${this.selectObjName}`;
  // this.template.querySelector("lightning-textarea").value = query;
  // }
  handleFilteringField(event) {
    this.selectFilteringField = event.detail.value;
    // const isWhere = this.soqlQuery.includes("WHERE");
    // const { select, from, orderBy, sortStrategy, nullQuery } = this.objQuery;
    // if (isWhere) {
    //   const query = `${select} ${from} ${orderBy} ${sortStrategy} ${nullQuery}`;
    //   this.soqlQuery = query;
    // }
  }
  handleFilteringOperation(event) {
    this.selectFilteringOperation = event.detail.value;
  }

  handleSortingStrategy(event) {
    this.selectSortingStrategy = event.detail.value;
    const isOrderBy = this.soqlQuery.includes("ORDER BY");
    const { select, from, orderBy, sortStrategy, nullQuery } = this.objQuery;
    if (isOrderBy) {
      const query = `${select} ${from} ${orderBy} ${sortStrategy} ${nullQuery}`;
      this.soqlQuery = query;
    }
  }

  handleNull(event) {
    this.selectNull = event.detail.value;
    const { select, from, orderBy, sortStrategy, nullQuery } = this.objQuery;
    const query = `${select} ${from} ${orderBy} ${sortStrategy} ${nullQuery}`;
    this.soqlQuery = query;
  }

  handleFilterValueChange(event) {
    this.selectFilterValue = event.detail.value;
    console.log("this.objQuery;", Object.values(this.objQuery));
    // const { select, from, orderBy, sortStrategy, nullQuery, where, operation   } = this.objQuery;
  //   let query = "";
  //   // let query = `
  //   const SELECT = "SELECT " + this.selectFieldName;
  //   const FROM = "FROM " + this.selectObjName;
  //   const WHERE =
  //     "WHERE " +
  //     this.selectFilteringField +
  //     " " +
  //     this.selectFilteringOperation +
  //     " " +
  //     this.selectFilterValue;

  //   if (!this.selectFilterValue) {
  //     query = `${SELECT} ${FROM}`;
  //   } else {
  //     query = `${SELECT} ${FROM} ${WHERE}`;
  //   }
  //   this.template.querySelector("lightning-textarea").value = query;
  // }
}
}