# Copyright (c) 2021, kiran and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Property(Document):

	# validate

	def after_insert(self):
		frappe.msgprint((f'Document {self.name} insert successfully'))


	def validate(self):
		if(self.property_type=="Flat"):
			for amenity in self.amenities:
				if(amenity.amenity=="Outdoor Kitchen"):
					frappe.throw((f'Property of type <b> Flat </b> should not have amenity <b>{amenity.amenity}</b>'))

			# SQL
			#amenity = frappe.db.sql(f"""SELECT amenity FROM tabProperty Amenity Detail WHERE parent="{self.name}" AND parenttype ="Property" AND amenity="Outdoor Kitchen";""")
			#print(f"""\n\n{amenity}""")
			#if(amenity):
				#frappe.throw((f'Property of type <b> Flat </b> should not have amenity <b>{amenity}</b>'))


	
			







    