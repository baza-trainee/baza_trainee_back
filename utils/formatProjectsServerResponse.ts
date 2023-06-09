import { IProject } from './../types/index';
import { IProjectResponse } from '../types/index';

export const formatProjectsServerResponse = (
	projects: IProject[]
): IProjectResponse[] =>
	projects.map((project) => {
		const transformedTeamMembers = project.teamMembers.map((teamMember) => ({
			user: {
				name: teamMember.userId?.name || '',
				_id: teamMember.userId?._id || '',
			},
			role: {
				name: teamMember.roleId?.name || '',
				_id: teamMember.roleId?._id || '',
			},
		}));

		return {
			_id: project._id.toString(),
			title: {
				en: project.title.en,
				pl: project.title.pl,
				ua: project.title.ua,
			},
			imageUrl: project.imageUrl,
			deployUrl: project.deployUrl,
			isTeamRequired: project.isTeamRequired,
			creationDate: project.creationDate,
			launchDate: project.launchDate,
			complexity: project.complexity,
			teamMembers: transformedTeamMembers,
		} as IProjectResponse;
	});
