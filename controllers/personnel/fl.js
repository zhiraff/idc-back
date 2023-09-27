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
  .leftJoin('profession', 'FL.jobCode', 'profession.id')
  .leftJoin('department', 'FL.departmentMCC', 'department.id')
  .select('profession.name as jobName', 'department.name as departmentMCCname', 'FL.*')
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
                family, snils, inn, organization, department, departmentMCC,
                jobCode, tabNum, accNum, id_kadr, user) => {
    createObject = {
        sex: sex,
        family: family,
        organization: organization,
        jobCode: jobCode,
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
    if (typeof departmentMCC !== 'undefined'){
        createObject['departmentMCC'] = departmentMCC
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
            family, snils, inn, organization, department, departmentMCC,
            jobCode, tabNum, accNum, id_kadr, sort) => {
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
      if (typeof departmentMCC !== 'undefined'){
    queryObject['departmentMCC'] = departmentMCC
  }
      if (typeof jobCode !== 'undefined'){
    queryObject['jobCode'] = jobCode
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

  let resultData = await knex("FL")
  .leftJoin('profession', 'FL.jobCode', 'profession.id')
  .leftJoin('department', 'FL.departmentMCC', 'department.id')
  .select('profession.name as jobName', 'department.name as departmentMCCname', 'FL.*')
  .orderBy(sortField, sortDirect)
  .where(queryObject)
  .andWhereILike("signImport", queryObjectString.signImport)
  .andWhereILike("firstName", queryObjectString.firstName)
  .andWhereILike("secondName", queryObjectString.secondName)
  .andWhereILike("thirdName", queryObjectString.thirdName)
  .andWhereILike("sex", queryObjectString.sex)
  .andWhereILike("family", queryObjectString.family)
  .andWhereILike("snils", queryObjectString.snils)
  .andWhereILike("inn", queryObjectString.inn)
  .andWhereILike("organization", queryObjectString.organization)
  .andWhereILike("department", queryObjectString.department)
  .andWhereILike("tabNum", queryObjectString.tabNum)
  .andWhereILike("accNum", queryObjectString.accNum)
  .limit(prpg)
  .offset((pg-1)*prpg)

  let countData = await knex("FL")
  .where(queryObject)
  .andWhereILike("signImport", queryObjectString.signImport)
  .andWhereILike("firstName", queryObjectString.firstName)
  .andWhereILike("secondName", queryObjectString.secondName)
  .andWhereILike("thirdName", queryObjectString.thirdName)
  .andWhereILike("sex", queryObjectString.sex)
  .andWhereILike("family", queryObjectString.family)
  .andWhereILike("snils", queryObjectString.snils)
  .andWhereILike("inn", queryObjectString.inn)
  .andWhereILike("organization", queryObjectString.organization)
  .andWhereILike("department", queryObjectString.department)
  .andWhereILike("tabNum", queryObjectString.tabNum)
  .andWhereILike("accNum", queryObjectString.accNum)
  .first()
  .count('id as countRow')

  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg

  resultData.push(countData)

  return resultData

}

// обновление записи о физ.лице
 const updateFl = async (personnelId, signImport, firstName, secondName, thirdName, sex,
            family, snils, inn, organization, department, departmentMCC,
            jobCode, tabNum, accNum, id_kadr, user) => {
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
  if (typeof departmentMCC !== 'undefined'){
    updateObject['departmentMCC'] = departmentMCC
  }
  if (typeof jobCode !== 'undefined'){
    updateObject['jobCode'] = jobCode
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
  return knex("FL").first().where({ id: personnelId })
}

module.exports.get = getFl;
module.exports.getByParam = getFlParam;
module.exports.getOne = getOneFl;
module.exports.create = createFl;
module.exports.update = updateFl;
module.exports.delete = deleteFl;