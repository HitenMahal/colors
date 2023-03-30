import { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { UserAuth } from '../../hooks/use-auth-listener';
import { toggleReaction } from '../../services/firebase';

export default function Actions( { totalLikes, userReaction, docId}) {
    const { userAuth } = UserAuth();

    const [toggleLiked, setToggleLiked] = useState(userReaction > 0 ? true : false);
    const [likes, setLikes] = useState(totalLikes);
    const [currReaction, setCurrentReaction] = useState();

    const handleReaction = (r) => {
      console.log("REACTED");
      setCurrentReaction(r);
      toggleReaction(r, !toggleLiked, docId, userAuth.uid); // Firebase Toggle
      setToggleLiked(!toggleLiked);
      setLikes((likes) => (toggleLiked ? likes-1 : likes+1));
    }

    useEffect( () => {
      if ( userReaction > 0 ) {
        setCurrentReaction(userReaction);
      }
    }, [userReaction])

    useEffect( () => {
      if (!toggleLiked) {
        setCurrentReaction(undefined);
      }
    }, [toggleLiked])

    console.log("toggleLiked, CurrReaction", toggleLiked, currReaction);

    const colorVarients = {
      1: 'rounded-full h-8 w-8 bg-r1e',
      2: 'rounded-full h-8 w-8 bg-r2e',
      3: 'rounded-full h-8 w-8 bg-r3e',
      4: 'rounded-full h-8 w-8 bg-r4e',
      5: 'rounded-full h-8 w-8 bg-r5e',
      6: 'rounded-full h-8 w-8 bg-r6e',
      7: 'rounded-full h-8 w-8 bg-r7e',
    }

    return (
        <>
          <div className="flex justify-around p-4 pl-2 pt-2 mx-20 transition-all border-b-4">
            { currReaction ? (<a className={`${colorVarients[currReaction]}`} onClick={ () => {handleReaction(undefined)}}/>)
              : (
                <>
                <a className="rounded-full h-8 w-8 bg-gradient-to-br from-r1s to-r1e" onClick={ () => {handleReaction(1)}}/>
                <a className="rounded-full h-8 w-8 bg-gradient-to-br from-r2s to-r2e" onClick={ () => {handleReaction(2)}}/>
                <a className="rounded-full h-8 w-8 bg-gradient-to-br from-r3s to-r3e" onClick={ () => {handleReaction(3)}}/>
                <a className="rounded-full h-8 w-8 bg-gradient-to-br from-r4s to-r4e" onClick={ () => {handleReaction(4)}}/>
                <a className="rounded-full h-8 w-8 bg-gradient-to-br from-r5s to-r5e" onClick={ () => {handleReaction(5)}}/>
                <a className="rounded-full h-8 w-8 bg-gradient-to-br from-r6s to-r6e" onClick={ () => {handleReaction(6)}}/>
                <a className="rounded-full h-8 w-8 bg-gradient-to-br from-r7s to-r7e" onClick={ () => {handleReaction(7)}}/>
                </>
              )
            }
          </div>
          <div className="p-4 py-0 pl-3">
            <p className="font-bold text-[#E7E9FF]">{likes === 1 ? `${likes} pog` : `${likes} pogs`}</p>
          </div>
        </>
      );
    }
    
Actions.propTypes = {
    docId: PropTypes.string.isRequired,
    totalLikes: PropTypes.number.isRequired,
}