import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Mutations from '../../graphql/mutations'
const { CREATE_POST } = Mutations;

const CreatePost = () => {
	let [ mainImageUrl, setMainImageUrl ] = useState('');
	let [ mainImageFile, setMainImageFile ] = useState(null);
	// let [ bodyImageUrl, setBodyImageUrl ] = useState('');
	// let [ bodyImageFile, setBodyImageFile ] = useState(null);
	let [ createPost ] = useMutation(CREATE_POST)


	const previewMainImage = (e) => {
		const reader = new FileReader();
		const file = e.currentTarget.files[0];
		reader.onloadend = () => {
			setMainImageFile(mainImageFile = file)
			setMainImageUrl(mainImageUrl = reader.result)
		}

		if (file) {
			reader.readAsDataURL(file);
		} else {
			setMainImageUrl('')
			setMainImageFile(null)
		}
	}

	// const previewBodyImage = (e) => {
	// 	const reader = new FileReader();
	// 	const file = e.currentTarget.files[0];
	// 	reader.onloadend = () => {
	// 		setBodyImageFile(bodyImageFile = file)
	// 		setBodyImageUrl(bodyImageUrl = reader.result)
	// 	}

	// 	if (file) {
	// 		reader.readAsDataURL(file);
	// 	} else {
	// 		setBodyImageUrl('')
	// 		setBodyImageFile(null)
	// 	}
	// }

	const handleSubmit = (e) => {
		e.preventDefault();
		// let formData = new FormData();
		// formData.append('mainImage', mainImageFile)
		
	}
	
	const mainImagePreview = 
	mainImageUrl ? 
		<img 
			height='50%'
			width='50%'
			object-fit='contain'
			alt={mainImageFile.name}
			src={mainImageUrl}
		/> : null;
	
	// const bodyImagePreview = 
	// bodyImageUrl ? 
	// 	<img 
	// 		height='50%'
	// 		width='50%'
	// 		object-fit='contain'
	// 		alt={bodyImageFile.name}
	// 		src={bodyImageUrl}
	// 	/> : null;

	return (
		<div>
			<h2>Create Post</h2>
			<form
				onSubmit={e => {
					// handleSubmit(e);
					console.log(mainImageFile)
					createPost({
						variables: {
							file: mainImageFile
						}
					}).then(data => console.log(data))
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

			{/* <div>
				<h2>Body Image</h2>
				<input
					type='file'
					value={''}
					onChange={previewBodyImage}
				/>
				{bodyImagePreview}
			</div> */}
			<button type='submit'>Submit</button>
			</form>
		</div>
	)
}

export default CreatePost;