import frappe

@frappe.whitelist()
def check_property_types(property_type=None):
    return frappe.db.sql(f"""select name, property_type from tabProperty where property_type = 'Flat' ;""", as_dict=True)