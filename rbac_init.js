/*
const RBAC = require('rbac').default;
const secure = require('rbac/controllers/express');

const rb = new RBAC({
  roles: ['admin', 'security', 'orb_response', 'operator', 'guest'],
  permissions: {
    users: ['create', 'read', 'update', 'delete'],              //Пользователи АС
    password: ['change', 'forgot'],                             //Пароли
    radionuclides: ['create', 'read', 'update', 'delete'],      //Перечень радионуклидов
    jobs: ['create', 'read', 'update', 'delete'],               //Должности
    departaments: ['create', 'read', 'update', 'delete'],       //Подразделения
    controls: ['create', 'read', 'update', 'delete'],           //Контрольные значения
    bodyparts: ['create', 'read', 'update', 'delete'],          //части тела
    controlkinds: ['create', 'read', 'update', 'delete'],       //Виды ИДК
    documentheaders: ['create', 'read', 'update', 'delete'],    //Заголовки документов
    documentbodys: ['create', 'read', 'update', 'delete'],      //Содержание документов
    documentfiles: ['create', 'read', 'update', 'delete'],      //Файлы документов
    be: ['create', 'read', 'update', 'delete'],                 //БФО
    hrs: ['create', 'read', 'update', 'delete'],                //СИЧ
    erd: ['create', 'read', 'update', 'delete'],                //ОЭД
    ctc: ['create', 'read', 'update', 'delete'],                //Хелатотерапия
    personal: ['import', 'switchfl'],                           //персонал
    fl: ['create', 'read', 'update', 'delete'],                 //прихлебаи (физ.лица)
    flborn: ['create', 'read', 'update', 'delete'],             //данные о рождении ФЛ
    fldocs: ['create', 'read', 'update', 'delete'],             //Документы ФЛ
    fladdress: ['create', 'read', 'update', 'delete'],          //Адреса ФЛ
    rbac: ['update'],
  },
  grants: {
    guest: ['create_user', 'forgot_password'],
    operator: ['change_password', 'radionuclides', 'jobs',
                'departaments', 'controls', 'bodyparts', 'controlkinds',
                'documentheaders', 'documentbodys', 'documentfiles', 'be',
                'hrs', 'erd', 'ctc', 'personal', 'fl', 'flborn', 'fldocs',
                'fladdress', 'rbac'],
    orb_response: ['read_be', 'read_hrs', 'read_erd', 'read_ctc'],
    security: ['read_be', 'read_hrs', 'read_erd', 'read_ctc'],
    admin: ['operator', 'user', 'update_rbac'],
  },
});
 
await rb.init();

module.exports = rb;
*/