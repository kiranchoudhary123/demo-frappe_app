import frappe
from estate_app.utils import sendmail

def validate(doc, event):
    pass
    #print(f"n\n\n{doc}, {event}")
    #frappe.throw("Error Occured")
    
def on_update(doc, event):
    print(f"n\n\n{doc}, {event}")
    frappe.msgprint(f"{doc.name} has been updated by {doc.owner}")  


def after_insert(doc, event):
    # create note on property insert
    print(f"n\n\n{doc.name}, {event}")

    note = frappe.get_doc({
        'doctype' : 'Note',
        'title' : f"{doc.name} Added",
        'public' : True,
        'content' : doc.description

    })  
    note.insert()
    frappe.db.commit()
    frappe.msgprint(f"{note.title} has benn created ")

    # send Mail

    agent_email = frappe.get_doc('Agent', doc.agent)
    msg = f"Hello <b>{doc.agent_name}, a property has been created on your behalf.</b>"
    attachments = [frappe.attach_print(doc.doctype, doc.name, file_name=doc.name)]
    sendmail(doc, [agent_email, 'testjohn@test.com'], msg, 'New Property', attachments)
    