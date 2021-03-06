"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReceiveModel {
    getWarehouse(knex) {
        return knex('warehouses')
            .orderBy('warehouse_name');
    }
    getProductList(knex, warehouseId) {
        return knex('products as p')
            .select('p.product_id', 'p.product_name', 'g.generic_name', 'u.unit_name')
            .innerJoin('generics as g', 'g.generic_id', 'p.generic_id')
            .innerJoin('units as u', 'u.unit_id', 'g.unit_id')
            .where('p.warehouse_id', warehouseId)
            .orderBy('p.product_name');
    }
    saveReceiveSummary(knex, data) {
        return knex('receives')
            .insert(data, 'receive_id');
    }
    saveReceiveDetail(knex, data) {
        return knex('receives_detail')
            .insert(data);
    }
    getReceivesList(knex, warehouseId) {
        const querySum = knex('receives_detail as d')
            .select(knex.raw('sum(d.cost*d.receive_qty)'))
            .as('total_cost')
            .whereRaw('d.receive_id=r.receive_id')
            .groupBy('d.receive_id');
        return knex('receives as r')
            .select('r.*', 's.supplier_name', querySum)
            .leftJoin('suppliers as s', 's.supplier_id', 'r.supplier_id')
            .where('r.warehouse_id', warehouseId)
            .orderBy('r.receive_date', 'DESC');
    }
    increseProduct(knex, lotId, receiveDate, productId, qty) {
        let sql = `
    update lots set qty=qty+${qty},
    receive_date='${receiveDate}'
    where lot_id=${lotId} and product_id=${productId}
    `;
        return knex.raw(sql, []);
    }
}
exports.ReceiveModel = ReceiveModel;
//# sourceMappingURL=receives.js.map