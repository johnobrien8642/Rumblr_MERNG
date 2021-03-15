import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

const CreatePost = () => {
	let [ mainImageUrl, setMainImageUrl ] = useState('');
	let [ mainImageFile, setMainImageFile ] = useState(null);
	let [ bodyImageUrl, setBodyImageUrl ] = useState('');
	let [ bodyImageFile, setBodyImageFile ] = useState(null);
	// let [ createPost ] = useMutation(CREATE_POST)


	const previewMainImage = (e) => {
		const reader = new FileReader();
		const file = e.currentTarget.files[0];
		reader.onloadend = () => {
			setMainImageUrl(mainImageUrl = reader.result)
			setMainImageFile(mainImageFile = file)
		}

		if (file) {
			reader.readAsDataURL(file);
		} else {
			setMainImageUrl('')
			setMainImageFile(null)
		}
	}

	const previewBodyImage = (e) => {
		const reader = new FileReader();
		const file = e.currentTarget.files[0];
		reader.onloadend = () => {
			setBodyImageUrl(bodyImageUrl = reader.result)
			setBodyImageFile(bodyImageFile = file)
		}

		if (file) {
			reader.readAsDataURL(file);
		} else {
			setBodyImageUrl('')
			setBodyImageFile(null)
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append('mainImage', mainImageFile);
		formData.append('bodyImage', bodyImageFile);
		for (var pair of formData.entries()) {
			console.log(pair[0]+','+pair[1]);
		}
		// createPost({
		// 	variables: { data: formData }
		// })
	}

	const mainImagePreview = 
	mainImageUrl ? 
		<img 
			height='50%'
			width='50%'
			object-fit='contain'
			src={mainImageUrl}
		/> : null;
	
	const bodyImagePreview = 
	bodyImageUrl ? 
		<img 
			height='50%'
			width='50%'
			object-fit='contain'
			src={bodyImageUrl}
		/> : null;

	return (
		<div>
			<h2>Create Post</h2>
			<form
				onSubmit={e => {
					handleSubmit(e);
				}}
				encType={'multipart/form-data'}
			>

			<div>
				<h2>Main Image</h2>
				<input
					type='file'
					value={''}
					onChange={previewMainImage}
				/>
				{mainImagePreview}
			</div>

			<div>
				<h2>Body Image</h2>
				<input
					type='file'
					value={''}
					onChange={previewBodyImage}
				/>
				{bodyImagePreview}
			</div>
			<button type='submit'>Submit</button>
			</form>
		</div>
	)
}

export default CreatePost;