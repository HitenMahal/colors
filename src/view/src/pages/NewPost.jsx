import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from "../hooks/use-auth-listener";
import { COLORS_LOGO_PATH, COLORS_REGISTER_PATH} from '../constants/paths';
import { DEFAULT_IMAGE_PATH } from '../constants/paths';
import { createPost } from '../services/firebase';
import useUser from '../hooks/use-user';
import Cropper from "react-easy-crop";
import getCroppedImg from '../services/image-crop';

const NewPost = () => {
    const { userAuth } = UserAuth();
    const { user: userObj } = useUser(userAuth.uid);  

    console.log("UserObj", userObj);

    const history = useNavigate();

    const [image, setImage] = useState();
    const [preview, setPreview] = useState('');  

    const [zoom, setZoom] = useState(1);
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [cropppedImageUrl, setCroppedImageUrl] = useState(); 

    const [caption, setCaption] = useState('');

    const [error, setError] = useState('');
    const isInvalid = (caption === '' || image === undefined);

    useEffect( () => {
        if (!image) {
            setPreview(undefined);
            return;
        }
        const objectUrl = URL.createObjectURL(image);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [image]);

    const handleImageChange = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setImage(undefined);
            return;
        }
        if (e.target.files[0]) {
          setImage(e.target.files[0]);
        }
    };   
      
    const onCropChange = (crop) => {
    setCrop(crop);
    };

    const onZoomChange = (zoom) => {
    setZoom(zoom);
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const onCrop = async () => {
        const croppedImageUrl = await getCroppedImg(preview, croppedAreaPixels);
        setCroppedImageUrl(croppedImageUrl);
    }
    
    const handlePost = async (e) => {
        e.preventDefault();
        try {
            await createPost( userObj.userId, userObj.username, caption, image); 
            setError("Post Made Successfully");
            setTimeout( history("/"), 2000);
        }
        catch (error) {
            setError(error.message);        
        }
    };

    useEffect( () => {
        document.title = 'New Post - Colors';
    })

    return (
            // Div to store the video that's running in the background
    <div className='flex justify-start items-center flex-col h-screen'>
        <div className='relative w-full h-full'>
        <video 
            src={COLORS_REGISTER_PATH}
            type="video/mp4"
            loop
            controls={false}
            muted
            autoPlay
            className='w-full h-full object-cover'
            id="register-bckgrnd-vid"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
                <h1 className="text-5xl mb-8 text-white">Create New Post</h1>
                <div className="flex flex-col items-center p-4 bg-white mb-w rounded">
                    <form onSubmit={handlePost} method="POST" className='font-bold font-mono'>
                        <img
                            className="rounded-lg h-[600px] w-[600px] flex"
                            src={preview || '/'}
                            alt={`profile`}
                            onError={(e) => {
                            e.target.src = DEFAULT_IMAGE_PATH;
                            }}
                        />
                        {/* {preview && <><Cropper 
                            image={preview || DEFAULT_IMAGE_PATH}
                            zoom={zoom}
                            crop={crop}
                            aspect={ 4/3 }
                            onCropChange={onCropChange}
                            onZoomChange={onZoomChange}
                            onCropComplete={onCropComplete}
                        />
                        <button onClick={onCrop}>Crop</button></>} */}
                        <input type="file" aria-label="img" className="py-5" onChange={handleImageChange} />
                        <input
                            aria-label="Enter a caption"
                            type="text"
                            placeholder="Caption"
                            className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                            onChange={({ target }) => setCaption(target.value)}
                            value={caption}
                        />
                        <button
                            disabled={isInvalid}
                            type="submit"
                            className={`bg-blue-medium text-white w-full rounded h-8 font-bold
                            ${isInvalid && 'opacity-50'}`}
                        >
                            Post
                        </button>
                    </form>
                    { error && <p className="mb-4 text-xs text-red-primary">{error}</p>}
                </div>
            </div>
        </div>
    </div>
    )
} 

export default NewPost;

