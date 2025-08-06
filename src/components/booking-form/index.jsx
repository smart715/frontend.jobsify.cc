"use client"

import {useState} from 'react'

import Image from 'next/image'

import Link from 'next/link'

import { BsWindowDesktop } from "react-icons/bs";

import { VscThreeBars } from "react-icons/vsc";

import { BiRefresh } from "react-icons/bi";

import { FaRegCreditCard } from "react-icons/fa6";

const BookingForm = () => {
    const [isChecked, setIsChecked] = useState(true);

    const handleChange = () => {
    setIsChecked(!isChecked);
    };

    return (
        <>
            <section className='booking-section'>
                <div className='wrapper new-books'>
                      <h2 className='cm-head'>Locations</h2>
                      <div className='com-div-border py-0'>
                        <div className='row align-items-start justify-content-between w-100'>
                            <div className='col-lg-3 right-left10'>
                                <div className='booking-contaner'>
                                    <div className="booking-left">
                                        <Image
                                            src="/em-icon.svg"
                                            alt="My Logo"
                                            width={128}
                                            height={129}
                                            id='woman-working-laptop-high' />
                                        <h2 id='location' >Location Selections</h2>
                                        <p id='location-info'>Please select a location for
                                            your appointment</p>
                                        <p id='questions'>Questions?</p>
                                        <p id='location-info'>Call (858) 939-3746 for help</p>

                                    </div>
                                    
                                </div>
                            </div>
                            <div className='col-lg-5 right-left10'>
                                <div className="booking-right">
                                    

                                        <input type="email" className='booking-input' /><br />
                                        <div className='booking-input d-flex align-items-center'>
                                            <Image
                                                src="/map010.jpg"
                                                alt="My Logo"
                                                width={45}
                                                height={44}
                                                id='woman-working-laptop-high' />
                                            <p className='ms-3 mb-0'>Main Location</p>
                                        </div>
                                        <input type="password" className='booking-input' id='password-input' />
                                        <div className='location-btn'>
                                            <button className='btn' id='discard-btn'>X Discard</button>
                                            <button className='btn' id='save-btn'>Save Changes</button>
                                        </div>
                                </div>
                            </div>
                            <div className='col-lg-4 col-lg-4 ps-4 pe-0'>
                            <div className='booking-contaner-rightCard pt-4'>

                                <div className="booking-righ-rightPart">
                                    <div id='booking-righ-top'>


                                        <div id='appearance' className='p-0'>
                                            <FaRegCreditCard />
                                            <h4 className='ms-2'>Appearance</h4>

                                        </div>
                                        <div className='d-flex align-items-center color-lis01'>
                                             <button className='btn btn-bok01'>
                                                     
                                             </button>
                                        </div>
                                        <div id='color-select' className='p-0'>
                                            <input type="color" id="" name="" value="#1d7bff" className='booking-container-right-input' />
                                            <input type="color" id="" name="" value="#F34747" />
                                            <input type="color" id="" name="" value="#222222" />
                                            <input type="color" id="" name="" value="#0f8c77" />
                                            <input type="color" id="" name="" value="#1ca00f" />
                                            <input type="color" id="" name="" value="#a32f96" />
                                            <input type="color" id="" name="" value="#cc7424" />
                                            <input type="color" id="multicolor" name="" value="" />
                                            <div>
                                        </div>

                                            <label className="form-label mt-3" htmlFor="" id='border-style'>Border Style</label><br />

                                            <select name="" class="form-select mb-3" id="booking-container-input">
                                                <option value="volvo">Flat</option>
                                                <option value="audi">Rounded Corners</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className='d-flex align-items-center justify-content-between' id="step">
                                        <div className='d-flex align-items-center'>
                                            <VscThreeBars id='step-icon' />
                                            <p className='m-0'>Step</p>
                                        </div>
                                        <div className='d-flex align-items-center' id='chanageorder'>
                                            <BiRefresh id='hanage-order' />
                                            <p id='chanage-order' className='m-0'>Chanage Order</p>
                                        </div>

                                    </div>

                                    <div id='step-container' className='p-0'>
                                        <select name="" class="form-select" id="booking-container-input">
                                            <option value="volvo">Locations</option>
                                            <option value="audi">Services</option>
                                            <option value="volvo">Service Extras</option>
                                            <option value="audi">Custom Fields for Booking</option>
                                            <option value="volvo">Service Durations</option>
                                            <option value="audi">Total Attendees</option>
                                            <option value="volvo">Agents</option>
                                            <option value="audi">Datepicker</option>
                                            <option value="volvo">Recurring Appointment</option>
                                            <option value="audi">Customer</option>
                                            <option value="volvo">Verify Order</option>
                                            <option value="audi">Payment Time</option>
                                            <option value="volvo">Payment Portion</option>
                                            <option value="audi">Payment Method</option>
                                            <option value="volvo">Payment Processors</option>
                                            <option value="audi">Payment Form</option>
                                            <option value="audi">Confirmation</option>
                                        </select>
                                        <div className='booking-righ-bottom'>
                                            <div className='booking-righ-bottom-hover'>
                                                <div className='booking-righ-bottom-toggle'>
                                                    
                                                    <div className="form-check form-switch">
                                                        <input className="form-check-input" type="checkbox"  
                                                        checked={isChecked}
                                                        onChange={handleChange}/>
                                                        
                                                    </div>

                                                    <p id='show-location-categories' className='mb-0'>Show location categories</p>
                                                </div>
                                                <p id='show-location-text'>If turned on, locations will be displayed in categories</p>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>
                            </div>
                            
                            
                        </div>
                     </div>

                </div>
            </section>
        </>
    )
}

export default BookingForm;
