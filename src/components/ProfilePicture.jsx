import pp1 from './../assets/pp-1.svg'
import pp2 from './../assets/pp-2.svg'
import pp3 from './../assets/pp-3.svg'
import pp4 from './../assets/pp-4.svg'
import pp5 from './../assets/pp-5.svg'
import pp6 from './../assets/pp-6.svg'
import pp7 from './../assets/pp-7.svg'
import pp8 from './../assets/pp-8.svg'
import pp9 from './../assets/pp-9.svg'
import pp10 from './../assets/pp-10.svg'
import pp11 from './../assets/pp-11.svg'
import pp12 from './../assets/pp-12.svg'
import pp13 from './../assets/pp-13.svg'
import pp15 from './../assets/pp-15.svg'
import pp16 from './../assets/pp-16.svg'
import { BiEdit } from 'react-icons/bi'

const ProfilePicture = ({gender}) => {
    const male = [pp1, pp2, pp3, pp4, pp5, pp6]
    const female = [pp8, pp10, pp13]
    const others = [pp7, pp9, pp11,pp12, pp15,pp16]


    const curr = gender === 'male' ? pp1 : gender ==='female' ? pp8 : pp7

    return (
        <div className='w-full flex justify-center items-center'>
            <div className='w-32 h-32 rounded-full relative'>
                <img src={curr} alt='Profile Picture' className='rounded-full w-32 h-32 mx-auto' />
            </div>
        </div>
    );
};

export default ProfilePicture;