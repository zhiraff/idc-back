/**
 * @swagger
 * components:
 *   schemas:
 *     Radionuclides:
 *       type: object
 *       required:
 *         - name
 *         - name_simple
 *       properties:
 *         id:
 *           type: integer
 *           description: id радионуклида
 *         name:
 *           type: string
 *           description: название радионуклида
 *         name_simple:
 *           type: string
 *           description: Упрощённое обозначение радионуклида
 *         name_beauty:
 *           type: string
 *           description: html-код для вставки названия
 *       example:
 *         id: 1
 *         name: Уран 234
 *         name_simple: U234
 *         name_beauty: U<sup>238</sup>
 */
/**
 * @swagger
 * tags:
 *   name: Radionuclides
 *   description: API для работы со справочником перечень радионуклидов
 * /Radionuclides:
 *   get:
 *     summary: Просмотр всех радионуклидов
 *     tags: [Radionuclides]
 *     responses:
 *       200:
 *         description: Просмотр всех радионуклидов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Radionuclides'
 *   post:
 *     summary: Создание нового радионуклида
 *     tags: [Radionuclides]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Radionuclides'
 *     responses:
 *       200:
 *         description: Радионуклид добавлен.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Radionuclides'
 *       500:
 *         description: Ошибка сервера
 * /Radionuclides/{id}:
 *   get:
 *     summary: Просмотр радионуклида по id
 *     tags: [Radionuclides]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: id радионуклида
 *     responses:
 *       200:
 *         description: радионуклид найденный по id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Radionuclides'
 *       404:
 *         description: радионуклид не найден
 *   put:
 *    summary: Обновление радионуклида по id
 *    tags: [Radionuclides]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: id радионуклида
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Radionuclides'
 *    responses:
 *      200:
 *        description: радионуклид обновлён
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Radionuclides'
 *      404:
 *        description: радионуклид не найден
 *      500:
 *        description: Ошибка сервера
 *   delete:
 *     summary: Удаление радионуклида по id
 *     tags: [Radionuclides]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: id радионуклида
 *
 *     responses:
 *       200:
 *         description: радионуклид удалён
 *       404:
 *         description: радионуклид не найден
 */