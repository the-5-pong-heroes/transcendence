import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {backend} from '../../../lib/backend';
import {useUserInfos} from './UserInfos';

interface Props {
	visible?: boolean;
	linkTo: string;
	page: string;
}

const EditUser = (props: Props) => {
	const navigate = useNavigate();
	const [value] = useState('');
    const [uploadApproved, setUploadApproved] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

	const {
		setUserName,
	} = useUserInfos();

	async function setUserInfosContext(value: string) {
		const userInfos: any = await backend.getUserByToken();
		setUploadApproved(true);
		setLoading(false);
		setUserName({userName: value});
		navigate('/');
	}

	async function createUser(value: string) {
		let UserCreation = {
			name: value,
			isRegistered: true,
		};
		const user = await backend.createUser(UserCreation);
		if (user.statusCode === 400) {
			setError(true);
			setUploadApproved(false);
			setLoading(false);
		}
		setUserInfosContext(value);
	}

	async function userLoginPage() {
		if (props.page === 'login') {
			const response = await createUser(value);
		}
	}
}
export default EditUser;
