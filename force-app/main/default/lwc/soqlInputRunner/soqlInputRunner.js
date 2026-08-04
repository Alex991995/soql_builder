import { api, track, LightningElement } from "lwc";
import getRecords from "@salesforce/apex/ObjectManager.getRecords";
import getCountQuery from "@salesforce/apex/ObjectManager.getCountQuery";

export default class SoqlInputRunner extends LightningElement {
  @api valueText;
  @api isNotFieldNameSelected;
  @track dataRecords = [];
  numberRecords = null;
  loading = false;
  recordError = "";
  isNotInitialRequest = false;

  handleValueChange(event) {
    event.target.value = this.valueText;
  }

  get columns() {
    if (this.dataRecords.length) {
      const countArray = [{ label: "", fieldName: "count" }];
      const firstObject = Object.keys(this.dataRecords[0]);

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
  get isDataReady() {
    return !!this.data;
  }

  get isNumberRecordsANumber() {
    return typeof this.numberRecords === "number";
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
    this.loading = true;
    getCountQuery({ query: this.valueText })
      .then((res) => {
        this.recordError = "";
        this.numberRecords = res;
      })
      .catch((err) => {
        this.numberRecords = null;
        this.recordError = err.body.message;
      })
      .finally(() => {
        this.loading = false;
      });
  }
  runRecords() {
    this.loading = true;
    getRecords({ query: this.valueText })
      .then((res) => {
        this.recordError = "";
        this.dataRecords = res;
      })
      .catch((err) => {
        this.dataRecords = [];
        this.recordError = err.body.message;
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
