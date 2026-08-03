import { api, track, LightningElement } from "lwc";
import getRecords from "@salesforce/apex/ObjectManager.getRecords";
import getCountQuery from "@salesforce/apex/ObjectManager.getCountQuery";

export default class SoqlInputRunner extends LightningElement {
  @api valueText;
  @api isNotFieldNameSelected;
  @track dataRecords = [];
  isNotInitialRequest = false;

  handleValueChange(event) {
    event.target.value = this.valueText;
  }

  // renderedCallback() {
  //   console.log(this.columns);
  //   console.log("isNotInitialRequest", this.isNotInitialRequest);
  // }

  // connectedCallback() {
  //   console.log("isNotInitialRequest", this.isNotInitialRequest);
  // }

  get columns() {
    if (this.dataRecords.length) {
      const countArray = [{ label: "", fieldName: "count" }];
      const firstObject = Object.keys(this.dataRecords[0]).reverse();

      const modifiedData = firstObject.map((key) => ({
        label: key,
        fieldName: key
      }));
      return countArray.concat(modifiedData);
    }
    return null;
  }

  get data() {
    if (!this.dataRecords.length) return null;
    return this.dataRecords.map((item, i) => ({ count: i + 1, ...item }));
  }
  get isDataAndColumnsReady() {
    return !!this.data && !!this.columns;
  }

  handleQueryClick() {
    if (!this.valueText) {
      return;
    }
    if (this.valueText.toLowerCase().includes("count")) {
      this.runCountQuery();
    } else {
      this.runRecords();
    }
    this.isNotInitialRequest = true;
  }

  runCountQuery() {
    getCountQuery({ query: this.valueText })
      .then((res) => console.log("runCountQuery", res))
      .catch((err) => console.error("runCountQuery", err));
  }
  runRecords() {
    getRecords({ query: this.valueText })
      .then((res) => {
        this.dataRecords = res;
        console.log("runRecords", res);
      })
      .catch((err) => console.error("runRecords", err));
  }
}
