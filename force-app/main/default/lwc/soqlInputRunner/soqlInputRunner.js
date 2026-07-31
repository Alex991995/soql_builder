import { api, track, LightningElement } from "lwc";
import getRecords from "@salesforce/apex/ObjectManager.getRecords";
import getCountQuery from "@salesforce/apex/ObjectManager.getCountQuery";

export default class SoqlInputRunner extends LightningElement {
  @api valueText = "";
  @track dataRecords = [];
  // @dat aRecords = [];

  // columns = [
  //   { label: "", fieldName: "count" },
  //   { label: "Id", fieldName: "Id" }
  // ];

  result = [
    {
      Id: "a0Ed200000HBY7pEAH"
    },
    {
      Id: "a0Ed200000HBY9REAX"
    },
    {
      Id: "a0Ed200000HG9vBEAT"
    },
    {
      Id: "a0Ed200000HGGqDEAX"
    }
  ];

  data = this.result.map((item, i) => {
    return {
      count: i + 1,
      ...item
    };
  });

  renderedCallback() {
    console.log(this.columns);
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

  handleQueryClick() {
    if (this.valueText.toLowerCase().includes("count")) {
      this.runCountQuery();
    } else {
      this.runRecords();
    }
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
