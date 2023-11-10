const knex = require("../../knex_init");

//Поулчить весь персонал (и на контр и не на контр)
const getFl = async (page, perpage, sort) => {
  const pg = typeof page !== 'undefined' && page !== '' ? page : 1
  const prpg = typeof perpage !== 'undefined' && perpage !== '' ? perpage : 25
  let sortField = 'id'
  let sortDirect = 'asc'
  if (typeof sort !== 'undefined'){
    if (sort.startsWith('-')){
      sortField = sort.slice(1)
      sortDirect = 'desc'
    }else{
      sortField = sort
    }
  }

  let resultData = await knex("FL")
  .leftJoin('profession', 'FL.jobCodeKey', 'profession.id')
  .leftJoin('department', 'FL.departmentMCCKey', 'department.id')
  .select('profession.name as jobName', 'department.name as departmentMCCName', 'FL.*')
  .orderBy(sortField, sortDirect)
  .limit(prpg)
  .offset((pg-1)*prpg)

  let countData = await knex("FL")
  .first()
  .count('id as countRow')
  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  return resultData
}

//создать персонал
const createFl = async ( signImport, firstName, secondName, thirdName, sex,
                family, snils, inn, organization, department, departmentMCCKey,
                jobCodeKey, tabNum, accNum, id_kadr, user) => {
    createObject = {
        sex: sex,
        family: family,
        organization: organization,
        jobCodeKey: jobCodeKey,
        accNum: accNum,
        createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
        updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    }
    if (typeof signImport !== 'undefined'){
        createObject['signImport'] = signImport
    }
    if (typeof firstName !== 'undefined'){
        createObject['firstName'] = firstName
    }
    if (typeof secondName !== 'undefined'){
        createObject['secondName'] = secondName
    }
    if (typeof thirdName !== 'undefined'){
        createObject['thirdName'] = thirdName
    }
    if (typeof snils !== 'undefined'){
        createObject['snils'] = snils
    }
    if (typeof inn !== 'undefined'){
        createObject['inn'] = inn
    }
    if (typeof department !== 'undefined'){
        createObject['department'] = department
    }
    if (typeof departmentMCCKey !== 'undefined'){
        createObject['departmentMCCKey'] = departmentMCCKey
    }
    if (typeof tabNum !== 'undefined'){
        createObject['tabNum'] = tabNum
    }
    if (typeof id_kadr !== 'undefined'){
        createObject['id_kadr'] = id_kadr
    }
    
    const result = await knex("FL").insert([createObject], ["id"]);
    createObject['id'] = result[0].id
    return createObject;
}

//Получить персонал, с постраничной пагинацией и параметрами
const getFlParam = async (page, perpage, signImport, firstName, secondName, thirdName, sex,
            family, snils, inn, organization, department, departmentMCCKey,
            jobCodeKey, tabNum, accNum, id_kadr, jobName, departmentMCCName, sort) => {
  // 1. Поиск по числовым значениям осуществляется через where
  // 2. Поиск по текстовым значением осуществлется через like
  // 3. Для полей, которые не обязательны для заполнения (в миграции не указано notNull() )
  // дополнительно проверяется на null !
  const pg = typeof page !== 'undefined' && page !== '' ? page : 1
  const prpg = typeof perpage !== 'undefined' && perpage !== '' ? perpage : 25
  let sortField = 'id'
  let sortDirect = 'asc'
  if (typeof sort !== 'undefined'){
    if (sort.startsWith('-')){
      sortField = sort.slice(1)
      sortDirect = 'desc'
    }else{
      sortField = sort
    }
  }
  let queryObject = {}
  let queryObjectString = {}
  if (typeof signImport !== 'undefined'){
    queryObjectString['signImport'] = "%"+signImport+"%"
  }else{
    queryObjectString['signImport'] = "%%"
  }
    if (typeof firstName !== 'undefined'){
      queryObjectString['firstName'] = "%"+firstName+"%"
  }else{
    queryObjectString['firstName'] = "%%"
  }
      if (typeof secondName !== 'undefined'){
        queryObjectString['secondName'] = "%"+secondName+"%"
  }else{
    queryObjectString['secondName'] = "%%"
  }
      if (typeof thirdName !== 'undefined'){
        queryObjectString['thirdName'] = "%"+thirdName+"%"
  }else{
    queryObjectString['thirdName'] = "%%"
  }
      if (typeof sex !== 'undefined'){
        queryObjectString['sex'] = "%"+sex+"%"
  }else{
    queryObjectString['sex'] = "%%"
  }
      if (typeof family !== 'undefined'){
        queryObjectString['family'] = "%"+family+"%"
  }else{
    queryObjectString['family'] = "%%"
  }
      if (typeof snils !== 'undefined'){
        queryObjectString['snils'] = "%"+snils+"%"
  }else{
    queryObjectString['snils'] = "%%"
  }
      if (typeof inn !== 'undefined'){
        queryObjectString['inn'] = "%"+inn+"%"
  }else{
    queryObjectString['inn'] = "%%"
  }
      if (typeof organization !== 'undefined'){
        queryObjectString['organization'] = "%"+organization+"%"
  }else{
    queryObjectString['organization'] = "%%"
  }
      if (typeof department !== 'undefined'){
        queryObjectString['department'] = "%"+department+"%"
  }else{
    queryObjectString['department'] = "%%"
  }
      if (typeof departmentMCCKey !== 'undefined'){
    queryObject['departmentMCCKey'] = departmentMCCKey
  }
      if (typeof jobCodeKey !== 'undefined'){
    queryObject['jobCodeKey'] = jobCodeKey
  }
      if (typeof tabNum !== 'undefined'){
        queryObjectString['tabNum'] = "%"+tabNum+"%"
  }else{
    queryObjectString['tabNum'] = "%%"
  }
      if (typeof accNum !== 'undefined'){
        queryObjectString['accNum'] = "%"+accNum+"%"
  }else{
    queryObjectString['accNum'] = "%%"
  }
      if (typeof id_kadr !== 'undefined'){
    queryObject['id_kadr'] = id_kadr
  }
  if (typeof jobName !== 'undefined'){
    queryObjectString['jobName'] = "%"+jobName+"%"
}else{
queryObjectString['jobName'] = "%%"
}
if (typeof departmentMCCName !== 'undefined'){
  queryObjectString['departmentMCCName'] = "%"+departmentMCCName+"%"
}else{
queryObjectString['departmentMCCName'] = "%%"
}

  let resultData = await knex("FL")
  .leftJoin('profession', 'FL.jobCodeKey', 'profession.id')
  .leftJoin('department', 'FL.departmentMCCKey', 'department.id')
  .select('profession.name as jobName', 'department.name as departmentMCCName', 'FL.*')
  .orderBy(sortField, sortDirect)
  .where(queryObject)
  //.andWhereILike("signImport", queryObjectString.signImport)
  .andWhere(qb => {
    if (queryObjectString.signImport === "%%"){
     return qb.whereILike("signImport", queryObjectString.signImport).orWhereNull("signImport")
    }else{
     return qb.whereILike("signImport", queryObjectString.signImport)
    }
  })
  //.andWhereILike("firstName", queryObjectString.firstName)
  .andWhere(qb => {
    if (queryObjectString.firstName === "%%"){
     return qb.whereILike("firstName", queryObjectString.firstName).orWhereNull("firstName")
    }else{
     return qb.whereILike("firstName", queryObjectString.firstName)
    }
 })
 
  //.andWhereILike("secondName", queryObjectString.secondName)
  .andWhere(qb => {
    if (queryObjectString.secondName === "%%"){
     return qb.whereILike("secondName", queryObjectString.secondName).orWhereNull("secondName")
    }else{
     return qb.whereILike("secondName", queryObjectString.secondName)
    }
 })
  //.andWhereILike("thirdName", queryObjectString.thirdName)
  .andWhere(qb => {
    if (queryObjectString.thirdName === "%%"){
     return qb.whereILike("thirdName", queryObjectString.thirdName).orWhereNull("thirdName")
    }else{
     return qb.whereILike("thirdName", queryObjectString.thirdName)
    }
  })
  .andWhereILike("sex", queryObjectString.sex)
  .andWhereILike("family", queryObjectString.family)
  //.andWhereILike("snils", queryObjectString.snils)
  .andWhere(qb => {
    if (queryObjectString.snils === "%%"){
     return qb.whereILike("snils", queryObjectString.snils).orWhereNull("snils")
    }else{
     return qb.whereILike("snils", queryObjectString.snils)
    }
  })
  //.andWhereILike("inn", queryObjectString.inn)
  .andWhere(qb => {
    if (queryObjectString.inn === "%%"){
     return qb.whereILike("inn", queryObjectString.inn).orWhereNull("inn")
    }else{
     return qb.whereILike("inn", queryObjectString.inn)
    }
  })
  .andWhereILike("organization", queryObjectString.organization)
  //.andWhereILike("department", queryObjectString.department)
  .andWhere(qb => {
    if (queryObjectString.department === "%%"){
     return qb.whereILike("department", queryObjectString.department).orWhereNull("department")
    }else{
     return qb.whereILike("department", queryObjectString.department)
    }
  })
  .andWhereILike("tabNum", queryObjectString.tabNum)
  .andWhereILike("accNum", queryObjectString.accNum)
  .whereIn('jobCodeKey', function() {
    this.select('id').from('profession')
    .whereILike("name", queryObjectString.jobName)
  })
  .andWhere(qb => {
    if (queryObjectString.departmentMCCName === "%%"){
    return qb.whereIn('departmentMCCKey', function() {
      this.select('id').from('department')
       .whereILike("name", queryObjectString.departmentMCCName)
    })
    .orWhereNull("departmentMCCKey")
    }else{
      return qb.whereIn('departmentMCCKey', function() {
        this.select('id').from('department')
         .whereILike("name", queryObjectString.departmentMCCName)
      })
    }
  })

  /*
  .whereIn('departmentMCCKey', function() {
     this.select('id').from('department')
      .whereILike("name", queryObjectString.departmentMCCName)
   
  //  .whereILike("name", queryObjectString.departmentMCCName)
  //  .andWhere(qb => {
  //    if (queryObjectString.departmentMCCName === "%%"){
  //    return qb.whereILike("name", queryObjectString.department).orWhereNull("name")
  //    }else{
   //   return qb.whereILike("name", queryObjectString.department)
  //    }
 //   })
  })
  */
  .limit(prpg)
  .offset((pg-1)*prpg)

  let countData = await knex("FL")
  .where(queryObject)
    //.andWhereILike("signImport", queryObjectString.signImport)
    .andWhere(qb => {
      if (queryObjectString.signImport === "%%"){
       return qb.whereILike("signImport", queryObjectString.signImport).orWhereNull("signImport")
      }else{
       return qb.whereILike("signImport", queryObjectString.signImport)
      }
    })
    //.andWhereILike("firstName", queryObjectString.firstName)
    .andWhere(qb => {
      if (queryObjectString.firstName === "%%"){
       return qb.whereILike("firstName", queryObjectString.firstName).orWhereNull("firstName")
      }else{
       return qb.whereILike("firstName", queryObjectString.firstName)
      }
   })
   
    //.andWhereILike("secondName", queryObjectString.secondName)
    .andWhere(qb => {
      if (queryObjectString.secondName === "%%"){
       return qb.whereILike("secondName", queryObjectString.secondName).orWhereNull("secondName")
      }else{
       return qb.whereILike("secondName", queryObjectString.secondName)
      }
   })
    //.andWhereILike("thirdName", queryObjectString.thirdName)
    .andWhere(qb => {
      if (queryObjectString.thirdName === "%%"){
       return qb.whereILike("thirdName", queryObjectString.thirdName).orWhereNull("thirdName")
      }else{
       return qb.whereILike("thirdName", queryObjectString.thirdName)
      }
    })
    .andWhereILike("sex", queryObjectString.sex)
    .andWhereILike("family", queryObjectString.family)
    //.andWhereILike("snils", queryObjectString.snils)
    .andWhere(qb => {
      if (queryObjectString.snils === "%%"){
       return qb.whereILike("snils", queryObjectString.snils).orWhereNull("snils")
      }else{
       return qb.whereILike("snils", queryObjectString.snils)
      }
    })
    //.andWhereILike("inn", queryObjectString.inn)
    .andWhere(qb => {
      if (queryObjectString.inn === "%%"){
       return qb.whereILike("inn", queryObjectString.inn).orWhereNull("inn")
      }else{
       return qb.whereILike("inn", queryObjectString.inn)
      }
    })
    .andWhereILike("organization", queryObjectString.organization)
    //.andWhereILike("department", queryObjectString.department)
    .andWhere(qb => {
      if (queryObjectString.department === "%%"){
       return qb.whereILike("department", queryObjectString.department).orWhereNull("department")
      }else{
       return qb.whereILike("department", queryObjectString.department)
      }
    })
    .andWhereILike("tabNum", queryObjectString.tabNum)
    .andWhereILike("accNum", queryObjectString.accNum)
    .whereIn('jobCodeKey', function() {
      this.select('id').from('profession')
      .whereILike("name", queryObjectString.jobName)
    })
    .andWhere(qb => {
      if (queryObjectString.departmentMCCName === "%%"){
      return qb.whereIn('departmentMCCKey', function() {
        this.select('id').from('department')
         .whereILike("name", queryObjectString.departmentMCCName)
      })
      .orWhereNull("departmentMCCKey")
      }else{
        return qb.whereIn('departmentMCCKey', function() {
          this.select('id').from('department')
           .whereILike("name", queryObjectString.departmentMCCName)
        })
      }
    })
  .first()
  .count('id as countRow')

  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg

  resultData.push(countData)

  return resultData

}

// обновление записи о физ.лице
 const updateFl = async (personnelId, signImport, firstName, secondName, thirdName, sex,
            family, snils, inn, organization, department, departmentMCCKey,
            jobCodeKey, tabNum, accNum, id_kadr, user) => {
    let updateObject = {}
    if (typeof signImport !== 'undefined'){
    updateObject['signImport'] = signImport
  }
  if (typeof firstName !== 'undefined'){
    updateObject['firstName'] = firstName
  }
  if (typeof secondName !== 'undefined'){
    updateObject['secondName'] = secondName
  }
  if (typeof thirdName !== 'undefined'){
    updateObject['thirdName'] = thirdName
  }
  if (typeof sex !== 'undefined'){
    updateObject['sex'] = sex
  }
  if (typeof family !== 'undefined'){
    updateObject['family'] = family
  }
  if (typeof snils !== 'undefined'){
    updateObject['snils'] = snils
  }
  if (typeof inn !== 'undefined'){
    updateObject['inn'] = inn
  }
  if (typeof organization !== 'undefined'){
    updateObject['organization'] = organization
  }
  if (typeof department !== 'undefined'){
    updateObject['department'] = department
  }
  if (typeof departmentMCCKey !== 'undefined'){
    updateObject['departmentMCCKey'] = departmentMCCKey
  }
  if (typeof jobCodeKey !== 'undefined'){
    updateObject['jobCodeKey'] = jobCodeKey
  }
  if (typeof tabNum !== 'undefined'){
    updateObject['tabNum'] = tabNum
  }
  if (typeof accNum !== 'undefined'){
    updateObject['accNum'] = accNum
  }
  if (typeof id_kadr !== 'undefined'){
    updateObject['id_kadr'] = id_kadr
  }
  updateObject['updatedAt'] = new Date()
      if (typeof user.username !== 'undefined'){
    updateObject['updatedBy'] = user.username
  }else{
    updateObject['updatedBy'] = 'unknown'
  }
   return knex("FL")
    .where({ id: personnelId })
    .update(updateObject);
 }

 //удаление части физ.лица
 const deleteFl = async (PersonnelId) => {
  return knex("FL").where({ id: PersonnelId }).del()
 }

 //Показать персонал подробно
const getOneFl = async(personnelId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  return knex("FL")
  .leftJoin('profession', 'FL.jobCodeKey', 'profession.id')
  .leftJoin('department', 'FL.departmentMCCKey', 'department.id')
  .first('profession.name as jobName', 'department.name as departmentMCCName', 'FL.*')
  .where({ "FL.id": personnelId })
}

module.exports.get = getFl;
module.exports.getByParam = getFlParam;
module.exports.getOne = getOneFl;
module.exports.create = createFl;
module.exports.update = updateFl;
module.exports.delete = deleteFl;