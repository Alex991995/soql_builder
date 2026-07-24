import { LightningElement, wire } from "lwc";
import getNameAllObjects from "@salesforce/apex/ObjectManager.getNameAllObjects";
import getNameFieldsOfObject from "@salesforce/apex/ObjectManager.getNameFieldsOfObject";

export default class Main extends LightningElement {
  @wire(getNameAllObjects) nameAllObjects;
  selectObjName = "";

  @wire(getNameFieldsOfObject, { objectName: "$selectObjName" })
  nameFields;

  /**
   * @description: Create list objects for lightning-select with props label and value
   */
  get nameOptions() {
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

  handleChange(event) {
    this.selectObjName = event.detail.value;
    console.log("dd");
    console.log(this.nameFields);
  }
}
