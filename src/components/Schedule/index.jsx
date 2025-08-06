"use client"

import { useState } from 'react';

import { TbPencilMinus } from "react-icons/tb";

import { FaPlusCircle } from "react-icons/fa";

import { IoMdClose } from "react-icons/io";

import { FiEdit3 } from "react-icons/fi";

import CalendarWithDropdown from './CalendarWithDropdown';

const Schedule = () => {
  const [isChecked, setIsChecked] = useState(true);

  const handleChange = () => {
    setIsChecked(!isChecked);
  };

    return(
        <>
            <section className='general-week-section'>
                <h2 className='cm-head'>General Weekly Schedule</h2>
                <div className='wrapper'>
                    <div className='general-week-container'>
                        
                        <div className='general-weekly-schedule-bottom crm-weeks'>
                            <div id='week-days'>
                                <div className='day-name-time d-flex align-items-center'>
                       
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox"  
                                        checked={isChecked}
                                        onChange={handleChange}/>
                                        
                                    </div>
                                    <button className='btn btn-mondays'> Monday </button>
                                </div>
                                <button type='button' className='btn btn-edits'>
                                    <span> 08:00am-05:00pm </span>
                                    <FiEdit3/>
                                </button>
                            </div>
                            <div id='week-days'>
                                <div className='day-name-time d-flex align-items-center'>
                       
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox"  
                                        checked={isChecked}
                                        onChange={handleChange}/>
                                        
                                    </div>
                                    <button className='btn btn-mondays'> Tuesday </button>
                                </div>
                                <button type='button' className='btn btn-edits'>
                                    <span> 08:00am-05:00pm </span>
                                    <FiEdit3/>
                                </button>
                            </div>

                            <div id='week-days'>
                                <div className='day-name-time d-flex align-items-center'>
                       
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox"  
                                        checked={isChecked}
                                        onChange={handleChange}/>
                                        
                                    </div>
                                    <button className='btn btn-mondays'> Wednesday </button>
                                </div>
                                <button type='button' className='btn btn-edits'>
                                    <span> 08:00am-05:00pm </span>
                                    <FiEdit3/>
                                </button>
                            </div>

                            <div id='week-days'>
                                <div className='day-name-time d-flex align-items-center'>
                       
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox"  
                                        checked={isChecked}
                                        onChange={handleChange}/>
                                        
                                    </div>
                                    <button className='btn btn-mondays'> Thursday </button>
                                </div>
                                <button type='button' className='btn btn-edits'>
                                    <span> 08:00am-05:00pm </span>
                                    <FiEdit3/>
                                </button>
                            </div>


                             <div id='week-days'>
                                <div className='day-name-time d-flex align-items-center'>
                       
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox"  
                                        checked={isChecked}
                                        onChange={handleChange}/>
                                        
                                    </div>
                                    <button className='btn btn-mondays'> Friday </button>
                                </div>
                                <button type='button' className='btn btn-edits'>
                                    <span> 08:00am-05:00pm </span>
                                    <FiEdit3/>
                                </button>
                            </div>


                            <div id='week-days'>
                                <div className='day-name-time d-flex align-items-center'>
                       
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox"  
                                        checked={isChecked}
                                        onChange={handleChange}/>
                                        
                                    </div>
                                    <button className='btn btn-mondays'> Saturday </button>
                                </div>
                                <button type='button' className='btn btn-edits'>
                                    <span> 08:00am-05:00pm </span>
                                    <FiEdit3/>
                                </button>
                            </div>


                            <div id='week-days-sunday'>
                                <div className='day-name-time d-flex align-items-center'>
                       
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox"  
                                        checked={isChecked}
                                        onChange={handleChange}/>
                                        
                                    </div>
                                    <button className='btn btn-mondays'> Sunday </button>
                                </div>
                                <button type='button' className='btn btn-edits'>
                                    <span> 08:00am-05:00pm </span>
                                    <FiEdit3/>
                                </button>
                            </div>

                          
                            <div className='schedule-save-btn-container mb-5 me-3 mt-4'>
                                <button type='button' className='btn cm-btn'>
                                    Save Weekly Schedule
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='general-week-section mt-5'>
                <h2 className='cm-head'>Days With Custom Schedules</h2>
                <div className='wrapper'>
                    <div className='general-week-container new-padings'>
                        <h5 className='mb-3'>Days With Custom Schedules</h5>
                        <div className='general-weekly-schedule-bottom'>
                            <div className='days-with-custom-schedules'>
                                
                                <div>
                                    <button type='button' id='addDay-btn' data-bs-toggle="modal" data-bs-target="#exampleModal">
                                        <FaPlusCircle id='addDay-btn-icon' />
                                        Add Day
                                    </button>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </section>

            <section className='general-week-section mt-5'>
                <div className='wrapper'>
                    <div className='general-week-container new-padings'>
                        <h5 className='mb-3'>Holidays & Days Off</h5>
                        <div className='general-weekly-schedule-bottom'>
                            <div className='days-with-custom-schedules'>
                                
                                <div>
                                    <button type='button' id='addDay-btn' data-bs-toggle="modal" data-bs-target="#exampleModal">
                                        <FaPlusCircle id='addDay-btn-icon' />
                                        Add Day
                                    </button>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </section>
              <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Custom schedule</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <CalendarWithDropdown/>
                                    </div>
                                    
                                    </div>
                                </div>
              </div>
        </>
    );
}

export default Schedule;
