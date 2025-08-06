"use client";

import { useState } from 'react'

import { FaRegNewspaper } from "react-icons/fa";

import { MdBlock } from "react-icons/md";

import { GoDatabase } from "react-icons/go";

import { CiCircleInfo } from "react-icons/ci";

import { GrInstall } from "react-icons/gr";

import { BiRecycle } from "react-icons/bi";

import { IoIosArrowDown } from "react-icons/io";

import { PiRecycleLight } from "react-icons/pi";

import { TfiReload } from "react-icons/tfi";


const PremiumFeatures = () => {

    const [featuresOpen, setFeaturesOpen] = useState(false);
    const [systemInfo, setSystemInfo] = useState(false);
    const [installAddons, setInstallAddons] = useState(false);
    const [taskDue, setTaskDue] = useState(false); 

    const hanldeFeatures = () => {
        setFeaturesOpen(!featuresOpen);
    };

    const hanldeSystemInfo = () => {
        setSystemInfo(!systemInfo);
    }


    const handleInstallAddons = () => {
        setInstallAddons(!installAddons);
    }

    const handleTaskDue = () => {
        setTaskDue(!taskDue);
    }

    const [isChecked, setIsChecked] = useState(true);

    const handleChange = () => {
        setIsChecked(!isChecked);
    };

    return (
        <>

            <section className='premium-features-section pt-5'>
              <div className='com-div-border'>
                <div className='wrapper'>
                    <div className='premium-features-container'>
                        <div className='' id='premium-features'>
                            <div id='license-status-div'>
                                <div id="blink">
                                </div>
                                <p id='license-status'>License Status: Active</p>
                            </div>
                            <div id='license-status-info' >Thank you for using LatePoint</div>

                        </div>
                        <div className=' premium-features-container-bottom'>
                            <div className='license-div'>
                                <p><FaRegNewspaper /></p>
                                <p>License Info</p>
                            </div>
                            <div className='deactivate-div'>
                                <p> <MdBlock /></p>
                                <p>Deactivate</p>
                            </div>

                        </div>
                    </div>

                </div>
              </div>

            </section>




            <section className='premium-features-section-features'>
                <div className='wrapper'>
                    <div className='premium-bottom-section cm-btn-div015'>
                        <div className='premium-bottom-row  pt-4 position-relative d-flex align-items-center w-100' onClick={hanldeFeatures} >
                            <div className='premium-features-flex d-flex align-items-center'>
                                <p id='premium-features-flex-icon'>
                                    <svg width="16" height="16" viewBox="0 0 131 131" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M46.7694 51.077V59.0769H12.3076V51.077H46.7694ZM51.077 46.7694V12.3076C51.0769 9.92865 49.1483 8.00013 46.7694 7.99997H12.3076C9.92857 8.00001 8.00001 9.92856 7.99997 12.3076V46.7694C8.00013 49.1483 9.92864 51.0769 12.3076 51.077V59.0769L11.9902 59.073C5.44515 58.9073 0.16973 53.6318 0.00390624 47.0867L0 46.7694V12.3076C4.35426e-05 5.61642 5.33961 0.172287 11.9902 0.00390624L12.3076 0H46.7694L47.0867 0.00390624C53.7372 0.172406 59.0769 5.61649 59.0769 12.3076V46.7694L59.073 47.0867C58.9072 53.6317 53.6317 58.9072 47.0867 59.073L46.7694 59.0769V51.077C49.1482 51.0768 51.0768 49.1482 51.077 46.7694Z" fill="black"/>
                                    <path d="M46.7694 120V128H12.3076V120H46.7694ZM51.077 115.692V81.2304C51.0769 78.8515 49.1483 76.923 46.7694 76.9228H12.3076C9.92857 76.9229 8.00001 78.8514 7.99997 81.2304V115.692C8.00013 118.071 9.92864 120 12.3076 120V128L11.9902 127.996C5.44515 127.83 0.16973 122.555 0.00390624 116.01L0 115.692V81.2304C4.35426e-05 74.5393 5.33961 69.0951 11.9902 68.9268L12.3076 68.9229H46.7694L47.0867 68.9268C53.7372 69.0953 59.0769 74.5393 59.0769 81.2304V115.692L59.073 116.01C58.9072 122.555 53.6317 127.83 47.0867 127.996L46.7694 128V120C49.1482 120 51.0768 118.071 51.077 115.692Z" fill="black"/>
                                    <path d="M115.691 51.077V59.0769H81.2294V51.077H115.691ZM119.999 46.7694V12.3076C119.999 9.92865 118.07 8.00013 115.691 7.99997H81.2294C78.8504 8.00001 76.9219 9.92856 76.9218 12.3076V46.7694C76.922 49.1483 78.8505 51.0769 81.2294 51.077V59.0769L80.9121 59.073C74.367 58.9073 69.0916 53.6318 68.9258 47.0867L68.9219 46.7694V12.3076C68.9219 5.61642 74.2615 0.172287 80.9121 0.00390624L81.2294 0H115.691L116.009 0.00390624C122.659 0.172406 127.999 5.61649 127.999 12.3076V46.7694L127.995 47.0867C127.829 53.6317 122.554 58.9072 116.009 59.073L115.691 59.0769V51.077C118.07 51.0768 119.999 49.1482 119.999 46.7694Z" fill="black"/>
                                    <path d="M65 116.333V85.667C65 83.4579 66.7909 81.667 69 81.667C71.2091 81.667 73 83.4579 73 85.667V116.333C73 120.344 74.0469 121.608 74.6035 122.059C75.3329 122.65 76.5993 123 78.8721 123H114.659C119.522 123 121.225 121.804 121.875 121.052C122.616 120.194 123 118.788 123 116.333V85.667C123 80.3074 121.629 77.8948 120.409 76.7529C119.145 75.5698 117.251 75 114.659 75H78.8721C76.6631 74.9999 74.8721 73.209 74.8721 71C74.8721 68.791 76.6631 67.0001 78.8721 67H114.659C118.238 67 122.514 67.7641 125.878 70.9141C129.286 74.1055 131 79.0268 131 85.667V116.333C131 119.211 130.643 123.139 127.929 126.281C125.123 129.529 120.656 131 114.659 131H78.8721C76.2088 131 72.539 130.683 69.5664 128.274C66.421 125.725 65 121.655 65 116.333Z" fill="black"/>
                                    </svg>


                                </p>
                                <p className='ms-2'>Features</p>

                            </div>
                        </div>
                        <div>
                            {featuresOpen && (
                                <div className='features-dropdown'>
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" id="namehandf" type="checkbox"  
                                        checked={isChecked}
                                        onChange={handleChange}/>
                                        
                                    </div>
                                    <p>Chat With Customers</p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className='premium-bottom-section cm-btn-div015'>
                        <div className='premium-bottom-row pt-4 position-relative d-flex align-items-center w-100' onClick={handleInstallAddons} >
                            <div className='premium-features-flex d-flex align-items-center'>
                                <p id='premium-features-flex-icon'>
                                    <svg width="16" height="16" viewBox="0 0 139 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M31.1788 10C31.1788 4.47715 35.6559 0 41.1788 0H99.5067C105.03 0 109.507 4.47715 109.507 10V12.6042H128.695C134.218 12.6042 138.695 17.0813 138.695 22.6042V169.825C138.695 175.348 134.218 179.825 128.695 179.825H10C4.47716 179.825 0 175.348 0 169.825V22.6042C0 17.0813 4.47715 12.6042 10 12.6042H31.1788V10ZM31.1788 22.6042H10V169.825H128.695V22.6042H109.507V38.4759C109.507 43.9988 105.03 48.4759 99.5067 48.4759H41.1788C35.6559 48.4759 31.1788 43.9988 31.1788 38.4759V22.6042ZM99.5067 10L41.1788 10V38.4759H99.5067L99.5067 10ZM70.011 60.3674C72.7724 60.3674 75.011 62.606 75.011 65.3674V148.29C75.011 151.051 72.7724 153.29 70.011 153.29C67.2496 153.29 65.011 151.051 65.011 148.29V65.3674C65.011 62.606 67.2496 60.3674 70.011 60.3674ZM99.1996 85.5757C101.961 85.5757 104.2 87.8143 104.2 90.5757V148.29C104.2 151.051 101.961 153.29 99.1996 153.29C96.4382 153.29 94.1996 151.051 94.1996 148.29V90.5757C94.1996 87.8143 96.4382 85.5757 99.1996 85.5757ZM42.1492 104.15C44.9106 104.15 47.1492 106.389 47.1492 109.15V148.29C47.1492 151.051 44.9106 153.29 42.1492 153.29C39.3877 153.29 37.1492 151.051 37.1492 148.29V109.15C37.1492 106.389 39.3877 104.15 42.1492 104.15Z" fill="black"/>
                                    </svg>

                                </p>
                                <p className='ms-2'>Installed Addons</p>

                            </div>
                        </div>
                        <div>
                            {installAddons && (
                                <div className='install-dropdown row row-cols-1 row-cols-lg-3 y-4 mb-5 mt-3'>
                                    <div className='col'>
                                    
                                        <div className='install-col-one cm-border01'>
                                            <p>Pro Features</p>
                                            <div className='install-col-one-text d-flex align-items-center install-col-one-text-bottom'>
                                                <div className=''>
                                                    <p>Core:1.1.9</p>
                                                </div>
                                                <div className='install-col-one-text-bottom'>
                                                    <p className='flex items-center ' id="install-database">Database:1.1.1 <span className='flex items-center' id='install-database-icon'><PiRecycleLight id="install-database-icon" /> RESET</span></p>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                    <div className='col'>
                                        <div className='install-col-one cm-border01'>
                                            <p>SMS Twilio</p>
                                            <div className='install-col-one-text install-col-one-text-bottom'>
                                                <div className=''>
                                                    <p>Core:1.1.9</p>
                                                </div>
                                                <div className='install-col-one-text-bottom'>
                                                    <p className='flex items-center ' id="install-database">Database:1.1.1 <span className='flex items-center' id='install-database-icon'><PiRecycleLight id="install-database-icon" /> RESET</span></p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='install-col-one cm-border01'>
                                            <p>WhatsApp Messages</p>
                                            <div className='install-col-one-text install-col-one-text-bottom'>
                                                <div className=''>
                                                    <p>Core:1.1.9</p>
                                                </div>
                                                <div className='install-col-one-text-bottom'>
                                                    <p className='flex items-center ' id="install-database">Database:1.1.1 <span className='flex items-center' id='install-database-icon'><PiRecycleLight id="install-database-icon" /> RESET</span></p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>


                    <div className='premium-bottom-section cm-btn-div015'>
                        <div className='premium-bottom-row pt-4 position-relative' onClick={handleTaskDue} >
                            <div className='premium-features-flex d-flex align-items-center'>
                                <p id='premium-features-flex-icon'>
                                    <svg width="16" height="16" viewBox="0 0 133 135" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M96.2897 10H11.6012C10.7169 10 10 10.7169 10 11.6012V96.2897C10 97.174 10.7169 97.8909 11.6012 97.8909H96.2897C97.174 97.8909 97.8909 97.174 97.8909 96.2897V11.6012C97.8909 10.7169 97.174 10 96.2897 10ZM11.6012 0C5.19402 0 0 5.19402 0 11.6012V96.2897C0 102.697 5.19402 107.891 11.6012 107.891H96.2897C102.697 107.891 107.891 102.697 107.891 96.2897V11.6012C107.891 5.19402 102.697 0 96.2897 0H11.6012Z" fill="black"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M133 24.5557V115.499L132.999 115.567C132.791 123.265 128.738 128.284 123.963 131.161C119.431 133.891 114.254 134.74 110.792 134.74H23.0098V124.74H110.792C112.938 124.74 116.209 124.158 118.803 122.595C121.14 121.187 122.882 119.068 123 115.358V24.5557H133Z" fill="black"/>
                                    </svg>

                                </p>
                                <p className='ms-2'>Tasks Due</p>

                            </div>
                        </div>
                        <div>
                            {taskDue && (
                                <div className='system-dropdown sm-parat'>
                                 <p> <small> Nothing to do  </small> </p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </section>

        </>

    )
}

export default PremiumFeatures;
