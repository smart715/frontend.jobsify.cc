"use client"

import React, { useState } from 'react';

import { LuPencilLine } from "react-icons/lu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdAddCircle } from "react-icons/io";
import { FiEdit3 } from "react-icons/fi";
import { VscChromeMinimize } from "react-icons/vsc";

const Tax = () => {
    const [newTask, setNewTask] = useState([]);
    const [toggleMap, setToggleMap] = useState({});

    const handleAddTask = () => {
        const newId = Date.now();

        setNewTask([...newTask, { id: newId }]);
        setToggleMap((prev) => ({ ...prev, [newId]: false }));
    };

    const handleDeleteTask = (idToRemove) => {
        setNewTask(newTask.filter((div) => div.id !== idToRemove));
        setToggleMap((prev) => {
            const copy = { ...prev };

            delete copy[idToRemove];

            return copy;
        });
    };

    const handleToggle = (id) => {
        setToggleMap((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <>
            <section className='tax-section'>
                <div className='wrapper'>
                    <article>
                        <div>
                            <h2 className='cm-head'> Payment Process </h2>
                        </div>
                        {newTask.map((div) => (
                            <div key={div.id}>
                                <div className='tax-section-row-one btn-div0150' onClick={() => handleToggle(div.id)}>
                                    <div className='tax-section-row-one-left row w-100'>
                                        
       
                                            <div className='col-lg-7 d-flex align-items-center'>
                                                <div className='tax-section-row-one-left-icon-container sm-icons'>
                                                    <svg width="75" height="132" viewBox="0 0 75 132" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M26.6887 13.3444C26.6887 20.7143 20.7143 26.6887 13.3444 26.6887C5.97448 26.6887 0 20.7143 0 13.3444C0 5.97448 5.97448 0 13.3444 0C20.7143 0 26.6887 5.97448 26.6887 13.3444Z" fill="#CACACA"/>
                                                        <path d="M26.6887 65.151C26.6887 72.5209 20.7143 78.4954 13.3444 78.4954C5.97448 78.4954 0 72.5209 0 65.151C0 57.7811 5.97448 51.8066 13.3444 51.8066C20.7143 51.8066 26.6887 57.7811 26.6887 65.151Z" fill="#CACACA"/>
                                                        <path d="M26.6887 118.53C26.6887 125.9 20.7143 131.874 13.3444 131.874C5.97448 131.874 0 125.9 0 118.53C0 111.16 5.97448 105.186 13.3444 105.186C20.7143 105.186 26.6887 111.16 26.6887 118.53Z" fill="#CACACA"/>
                                                        <path d="M74.6458 13.3444C74.6458 20.7143 68.6713 26.6887 61.3014 26.6887C53.9315 26.6887 47.957 20.7143 47.957 13.3444C47.957 5.97448 53.9315 0 61.3014 0C68.6713 0 74.6458 5.97448 74.6458 13.3444Z" fill="#CACACA"/>
                                                        <path d="M74.6458 65.151C74.6458 72.5209 68.6713 78.4954 61.3014 78.4954C53.9315 78.4954 47.957 72.5209 47.957 65.151C47.957 57.7811 53.9315 51.8066 61.3014 51.8066C68.6713 51.8066 74.6458 57.7811 74.6458 65.151Z" fill="#CACACA"/>
                                                        <path d="M74.6458 118.53C74.6458 125.9 68.6713 131.874 61.3014 131.874C53.9315 131.874 47.957 125.9 47.957 118.53C47.957 111.16 53.9315 105.186 61.3014 105.186C68.6713 105.186 74.6458 111.16 74.6458 118.53Z" fill="#CACACA"/>
                                                    </svg>

 
                                                    
                                                </div>
                                                <div>
                                                    <span className='putnamcounty'>Putnam County</span>
                                                    <span className='percentage'> percentage</span>
                                                </div>
                                            </div>
                                            <div className='col-lg-5 d-grid justify-content-end'>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteTask(div.id);
                                                        }}
                                                        className="btn p-0">
                                                        <FiEdit3/>

                                                    </button>
                                            </div>
                                        
                                    </div>
                                    
                                </div>


                                {toggleMap[div.id] && (
                                    <>
                                        <div className='tax-section-toggle'>
                                            <div className='tax-section-toggle-row-one'>
                                                <div className='tax-section-tax-name'>Tax Name</div>
                                                <div className='tax-section-tax-input-div'>
                                                    <input type="text" placeholder='text' className='tax-section-tax-input' />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='tax-section-toggle'>
                                            <div className='tax-section-toggle-row-one'>
                                                <div className='tax-section-tax-type'>Tax Type</div>
                                                <div className='tax-section-toggl-right-part'>
                                                    <select className="Custom-schedule-select">
                                                        <option value="singleday">Single Day</option>
                                                        <option value="datarange">Data Range</option>
                                                    </select>
                                                    <div>
                                                        <input type="text" placeholder='input' />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='tax-section-toggle'>
                                            <div className='tax-section-toggle-row-three'>
                                                <button>Delete</button>
                                                <button className='saveTax'>Save Tax</button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}

                    </article>

                    <article className='add-text-btn'>
                        <div className='tax-section-addBtn' onClick={handleAddTask}>
                            <IoMdAddCircle />
                            Add Tax
                        </div>
                    </article>
                </div>
            </section>
        </>
    );
}

export default Tax;
