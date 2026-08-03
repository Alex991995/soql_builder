public with sharing class ObjectManager {
  @AuraEnabled(cacheable=true)
  public static List<String> getNameAllObjects() {
    List<String> sObjectList = new List<String>();
    for (Schema.SObjectType objTyp : Schema.getGlobalDescribe().Values()) {
      String name = objTyp.getDescribe().getName();
      sObjectList.add(name);
    }
    sObjectList.sort();
    return sObjectList;
  }

  @AuraEnabled(cacheable=true)
  public static List<String> getNameFieldsOfObject(String objectName) {
    List<String> fieldList = new List<String>();

    Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();

    Set<String> fieldMap = schemaMap.get(objectName)
      .getDescribe()
      .fields.getMap()
      .keySet();

    for (String f : fieldMap) {
      fieldList.add(f.capitalize());
    }
    return fieldList;
  }

  @AuraEnabled
  public static List<sObject> getRecords(String query) {
    try {
      List<sObject> sObjList = Database.query(query, AccessLevel.USER_MODE);
      List<sObject> sObjListWithoutId = new List<sObject>();
      
      Boolean containsId = query.contains('Id'); 
      if(!containsId) {
        for(sObject sObj : sObjList) {
            sObjListWithoutId.add(sObj.clone(false, false, false, false));
        }
        return sObjListWithoutId;
      }
      return sObjList;
    } catch (Exception  e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static Integer getCountQuery(String query) {
    try {
      Integer num = Database.countQuery(query, AccessLevel.USER_MODE);
      return num;
    } catch (Exception  e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
