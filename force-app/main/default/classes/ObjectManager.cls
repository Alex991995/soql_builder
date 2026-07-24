public with sharing class ObjectManager {

  @AuraEnabled(cacheable=true)
  public static List<String> getNameAllObjects() {
    List<String> sObjectList = new List<String>();
    for (Schema.SObjectType objTyp : Schema.getGlobalDescribe().Values()) {
      String name = objTyp.getDescribe().getName();
      SobjectList.add(name);
    }
    sObjectList.sort();
    return sObjectList;
  }

  @AuraEnabled(cacheable=true)
  public static List<String> getNameFieldsOfObject( String objectName) {
    List<String> fieldList = new List<String>();

    Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();

    Set<String> fieldMap = schemaMap.get(objectName)
      .getDescribe()
      .fields.getMap()
      .keySet();

    for (String f : fieldMap) {
      if (f == 'id') {
        continue;
      }
      fieldList.add(f.capitalize());
    }
    return fieldList;
  }
}
