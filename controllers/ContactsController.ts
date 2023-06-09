import { Request, Response } from 'express';
import ContactsModel from '../models/Contacts';

export const getContacts = async (req: Request, res: Response) => {
	try {
		const contactsData = await ContactsModel.findOne();
		if (contactsData) {
			res.status(200).json({ contacts: contactsData.contacts });
		} else {
			res.status(404).json({ message: 'Contacts data not found' });
		}
	} catch (error) {
		console.error('Error retrieving contacts data', error);
		res
			.status(500)
			.json({ error: 'An error occurred while retrieving contacts data' });
	}
};

export const updateContacts = async (req: Request, res: Response) => {
	try {
		const contactsData = req.body.contacts;

		const updatedContacts = await ContactsModel.findOneAndUpdate(
			{},
			{ contacts: contactsData },
			{ upsert: true, new: true }
		);

		if (updatedContacts) {
			if (updatedContacts.isNew) {
				res.status(201).json({
					message: 'Contacts data created successfully',
					contacts: updatedContacts.contacts,
				});
			} else {
				res.status(200).json({
					message: 'Contacts data updated successfully',
					contacts: updatedContacts.contacts,
				});
			}
		}
	} catch (error) {
		console.error('Error saving contacts data', error);
		res.status(500).json({
			error: 'An error occurred while saving contacts data',
		});
	}
};
