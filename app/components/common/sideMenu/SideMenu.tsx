import { SignOut, X } from '@phosphor-icons/react/dist/ssr';
import React from 'react'
import AvatarSideMenu from '../AvatarSideMenu';
import SideMenuList from './SideMenuList';
import { useRecoilState } from 'recoil';
import { kakaoUserState } from '@/app/recoil/atom';
import { saveToLocalStorage } from '@/app/recoil/recoilUtils';
import { useRouter } from 'next/navigation';

interface SideMenuProps {
  isOpen: boolean;
  onClose: VoidFunction;
  userName?: string;
  userProfile?: string;
  kakaoUserId?: number;
}
export default function SideMenu({ 
  isOpen, 
  onClose,
  userName,
  userProfile,
  kakaoUserId
}:SideMenuProps) {

  const [,setGloabalKakaoUserState] = useRecoilState(kakaoUserState);
  const router = useRouter();

  const handleLogout = () => {
    setGloabalKakaoUserState({
      kakaoUserId: null,
      nickname: "",
      profile_image: "",
    });
    saveToLocalStorage("kakaoUserJWT", "");
    onClose();
    router.push('/');
  };
  const sideMenuUserName = userName? userName : "?";
  return (
    <section>
      {/* 오버레이 */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-[50] ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      ></div>
  
      {/* 사이드 메뉴 */}
      <div
        className={`fixed top-0 left-0 h-[100vh] w-[80vw] bg-white shadow-lg px-1 py-4 flex flex-col box-border
        transform transition-transform duration-300 z-[51] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Side Header */}
        <div
          className="w-full flex justify-end items-center cursor-pointer mb-4"
          onClick={onClose}
        >
          <X className="mr-1" color={"#6C7072"} size={24} />
        </div>
  
        {/* User Profile */}
        <div className="w-full flex flex-col items-start pl-4 gap-4 mb-[32px]">
          <AvatarSideMenu src={userProfile} />
          <p className="text-[16px]">
            <strong className="text-[#6161CE] text-bold">{sideMenuUserName}</strong> 님
          </p>
        </div>
  
        <div className="w-full bg-[#dbdbdb] h-[1px] mb-2"></div>
  
        {/* Menu List (scrollable content) */}
        <div className=" overflow-y-auto">
          <SideMenuList kakaoUserId={kakaoUserId}/>
        </div>
  
        {/* Logout Button */}
        <div className="w-full h-[7vh] flex justify-start items-center text-[#6C7072] font-bold border-t border-[#dbdbdb] mt-2 cursor-pointer"
          onClick={handleLogout}
        >
          <SignOut
            color="#6C7072"
            fill="bold"
            size={18}
            className="mx-2.5"
          ></SignOut>
          로그아웃
        </div>
      </div>
    </section>
  );
}
