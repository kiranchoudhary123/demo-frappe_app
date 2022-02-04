// Copyright (c) 2021, kiran and contributors
// For license information, please see license.txt

frappe.ui.form.on('Property', {
	setup: function (frm) {

		frm.check_amenities_duplicate = function (frm, row) {
			frm.doc.amenities.forEach(item => {

				if (row.amenity == '' || row.idx == item.idx) {
					//pass
				}
				else {
					if (row.amenity == item.amenity) {

						//clear field

						frappe.throw(__(`${item.amenity} already exists row ${item.idx}`));
						row.amenity = '';
						frm.refresh_field('amenities');
					}
				}
			
				
			})

		}
		// check flat against outdoor kitchen
		frm.check_flat_against_outdoor_kitchen = function (frm, row) {
			if (row.amenity == "Outdoor Kitchen" && frm.doc.property_type == "Flat") {

				frappe.throw(__(`${row.amenity} can not exists in a flat`));
				row.amenity = '';
				frm.refresh_field('amenities');

			}
		}
			//compute total
			frm.compute_total= function(frm){
				let total = 0;
				//loop thriugh the child table
				frm.doc.amenities.forEach(d=>{
					total = total + d.amenity_price;

				})
				// new total
				let new_total = frm.doc.property_price + total;
				if(frm.doc.discount){
					new_total = new_total - (new_total * (frm.doc.discount/100))
				}
				console.log(new_total);
				//set grand total
				frm.set_value('grand_total', new_total)
			},
			

			//copy discount to amenities

			frm.copy_discount = function(frm){
				frm.doc.amenities.forEach(d=>{
					d.discount = frm.doc.discount;
				})
				frm.refresh_field('amenities');
			}

	},
	refresh: function (frm) {
		// UPDATE FIELD BY USING SCRIPTING

		// Say Hi
		frm.add_custom_button('Say Hi', () => {
		frappe.prompt('Address', ({ value }) => {
		if(value){
			frm.set_value('address', value);
			frm.refresh_field('address')
		frappe.msgprint(__('Address Field  updated with ${value}'));
		}
		})



		
	}, "Action");

	// check the property type
	frm.add_custom_button('Check Property Type', () => {
		let property_type = frm.doc.property_type
		//make ajax call
		frappe.call({
			method: "estate_app.estate_app.doctype.property.api.check_property_types",
			args: {'property_type':property_type},
			callback: function(r) {
				
				//code snipppet
				console.log(r);
				if(r.message.length>0){
					let header = `<h3>Below propertys is of type ${property_type}</h3>`;
					let body = ``;
					r.message.forEach(d=>{
						let cont = `<p>Name: ${d.name}: <a href='/app/property/${name}'>Visit</a>`
						body = body + cont;
					})
					let all = header + body;
					//message print
				frappe.msgprint(__(all));
				}
				
				
			}
		})
	}, "Action");

	},
	property_price: function(frm){
		frm.compute_total(frm);
	},
	discount: function(frm){
		frm.copy_discount(frm);
		frm.compute_total(frm);
	}
	
	
});
//Amenities child table

frappe.ui.form.on('Property Amenity Detail', {

	amenity: function (frm, cdt, cdn) {
		//grab the entire record
		let row = locals[cdt][cdn]
		frm.check_flat_against_outdoor_kitchen(frm, row);
		frm.check_amenities_duplicate(frm, row, row.amenity);
		frm.compute_total(frm);
	},
	amenities_remove: function(frm, cdt, cdn){
		frm.compute_total(frm);
	}

})
