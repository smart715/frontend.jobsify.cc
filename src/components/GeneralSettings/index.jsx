'use client';

import { useState , useRef } from 'react';

import Link from 'next/link';

import Image from 'next/image';

import Select from 'react-select'

import { IoMdInformationCircleOutline } from "react-icons/io";

import { TbExternalLink } from "react-icons/tb";

import { PiDownloadSimpleBold } from "react-icons/pi";

import TextEditor from './TextEditor';

const GeneralSettings = () => {
    const options = [
        { value: 'Approved', label: 'Approved' },
        { value: 'PendingApproved', label: 'Pending Approved' },
        { value: 'Complted', label: 'Complted' }
    ]

    const appear = [
        { value: 'Approved', label: 'Approved' },
        { value: 'PendingApproved', label: 'Pending Approved' },
        { value: 'Complted', label: 'Complted' }
    ]

    const blocktime = [
        { value: 'Approved', label: 'Approved' },
        { value: 'PendingApproved', label: 'Pending Approved' },
        { value: 'Complted', label: 'Complted' }
    ]

    const hidden = [
        { value: 'Approved', label: 'Approved' },
        { value: 'PendingApproved', label: 'Pending Approved' },
        { value: 'Complted', label: 'Complted' }
    ]

    const knowck = [
        { value: '12-hour clock', label: 'Approved' },
        { value: '24-hour clock', label: 'Pending Approved' }
    ]

    const ddformat = [
        { value: 'mmddyyy', label: 'MM/DD/YYYY' },
        { value: 'yyyyddmm', label: 'YYYY/DD/MM' }
    ]

    const countryl = [
        { value: 'australia', label: 'Australia' },
        { value: 'austria', label: 'Austria' },
        { value: 'brazil', label: 'Brazil' },
    ]

    

    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('/clients-logo.png'); 

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();

            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };

            reader.readAsDataURL(file);
        } else {
             setPreviewImage('/clients-logo.png');
        }
    };

    const [ctext, setCText] = useState('{{customer_full_name}}');

    const numberss = [
        { value: '20', label: '20' },
        { value: '50', label: '50' },
        { value: '100', label: '100' },
        { value: '200', label: '200' },
    ]


    

    return(
        <>
          <div className='general-setiings-code w-100'>
             <div className='comon-tops-sets w-100'>
                 <h2 className='cm-head'> Appointment Settings </h2>
             </div>
             <div className='inputs-div01 cm-style01 w-100 d-block'>
                 <div className='row align-items-start'>
                     <div className='col-3'>
                          <p> Time Restrictions </p>
                     </div>
                     <div className='col-9 pt-lg-0'>
                        <div className='right-offections'>
                            <div className='row gy-4 mt-0'>
                               
                                <div className='col-lg-6'>
                                    <div className='form-group'>
                                        <label className='form-label'> Default status </label>
                                        <Select options={options}
                                            name="default"
                                           className="basic-multi-select" />
                                    </div>
                                </div>
                                 <div className='col-lg-6'>
                                    <div className='form-group'>
                                        <label className='form-label'> Statuses that block timeslot </label>
                                        <Select options={appear}
                                          defaultValue={[{ value: 'Approved', label: 'Approved' }]}
                                          name="colors"
                                          isMulti
                                           className="basic-multi-select" />
                                    </div>
                                </div>
                                <div className='col-lg-6'>
                                    <div className='form-group'>
                                        <label className='form-label'> Statuses that appear on pending page </label>
                                        <Select options={blocktime}
                                        isMulti
                                         name="blocktime"
                                        defaultValue={[{ value: 'PendingApproved', label: 'Pending Approved' }]}
                                           className="basic-multi-select" />
                                    </div>
                                </div>
                                <div className='col-lg-6'>
                                    <div className='form-group'>
                                        <label className='form-label'> Statuses hidden on calendar </label>
                                        <Select options={hidden}
                                        isMulti
                                         name="blocktime"
                                        defaultValue={[{ value: 'PendingApproved', label: 'Pending Approved' }]}
                                           className="basic-multi-select" />
                                    </div>
                                </div>
                                <div className='col-lg-12'>
                                    <div className='form-group'>
                                        <label className='form-label'> Additional Statuses (comma separated) </label>
                                        <input type='text' className='form-control' placeholder='Additional Statuses (comma separated)'/>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                     </div>
                 </div>
                 <div className='row align-items-start'>
                     <div className='col-3'>
                          <p> Date and time </p>
                     </div>
                     <div className='col-9 pt-lg-0'>
                         <div className='row gy-4 mt-0'>
                             <div className='col-lg-6'>
                                 <div className='form-group'>
                                     <label className='form-label'> Time system </label>
                                     <Select options={knowck}
                                            name="default"
                                           className="basic-multi-select" />
                                 </div>
                             </div>
                             <div className='col-lg-6'>
                                 <div className='form-group'>
                                     <label className='form-label'> Date format </label>
                                     <Select options={ddformat}
                                            name="default" />
                                 </div>
                             </div>
                             <div className='col-lg-12'>
                                 <div className='form-group'>
                                     <label className='form-label'> Selectable intervals </label>
                                     <input type='text' className='form-control' placeholder='30 minutes'/>
                                 </div>
                             </div>
                             <div className='col-lg-6'>
                                 <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked"/>
                                    <label className="form-check-label" htmlFor='flexSwitchCheckChecked' >Show appointment end time
                                        <span className='d-block'> Show booking end time during booking process and on summary </span>
                                    </label>
                                </div>
                             </div>
                             <div className='col-lg-6'>
                                 <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked2"/>
                                    <label className="form-check-label" htmlFor='flexSwitchCheckChecked2'>Disable verbose date output
                                        <span className='d-block'> Use number instead of name of the month when outputting dates </span>
                                    </label>
                                </div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
             <div className='comon-tops-sets w-100'>
                 <h2 className='cm-head'> Restrictions </h2>
             </div>
             <div className='inputs-div01 cm-style01 w-100 d-block'>
                 <div className='row align-items-start'>
                     <div className='col-3'>
                          <p> Statuses</p>
                     </div>
                     <div className='col-9 pt-lg-0'>
                        <div className='right-offections'>
                            <div className='row gy-4 mt-0'>
                                 <div className='col-lg-12'>
                                     <p className='bg-retricstions01'> You can set restrictions on earliest/latest dates in the future when your customer can place an appointment. You can either use a relative values like for example &quot;+1 month&quot;, &quot;+2 weeks&quot;, &quot;+5 days&quot;, &quot;+3 hours&quot;, &quot;+30 minutes&quot; (entered without quotes), or you can use
                                         a fixed date in format YYYY-MM-DD. Leave blank to remove any limitations. </p>
                                 </div>
                                <div className='col-lg-6'>
                                    <div className='form-group'>
                                        <label className='form-label'> Earliest Possible Booking </label>
                                        <input type='text' name='eari' className='form-control' placeholder='Earliest Possible Booking' />
                                    </div>
                                </div>
                                 <div className='col-lg-6'>
                                    <div className='form-group'>
                                        <label className='form-label'> Latest Possible Booking </label>
                                        <input type='text' name='latest' className='form-control' placeholder='Latest Possible Booking' />
                                    </div>
                                </div>
                                
                            </div>
                            
                        </div>
                     </div>
                 </div>
                 <div className='row align-items-start'>
                     <div className='col-3'>
                          <p> Quantity Restrictions </p>
                     </div>
                     <div className='col-9 pt-lg-0'>
                         <div className='row gy-4 mt-0'>
                             <div className='col-lg-12'>
                                 <div className='form-group'>
                                     <label className='form-label'> Maximum Number of Future
                                         Bookings per Customer </label>
                                     <input type='text' name='latest' className='form-control' placeholder='Maximum Number of Future Bookings per Customer' />
                                     
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
                 <div className='row align-items-start'>
                     <div className='col-3'>
                          <p> Cart Settings </p>
                     </div>
                     <div className='col-9 pt-lg-0 ps-lg-0'>
                        <div className='right-offections'>
                            <div className='row gy-4 mt-0 ms-0'>
                                <div className='col-lg-12 boder-none01'>
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked01"/>
                                        <label className="form-check-label" htmlFor='flexSwitchCheckChecked'> Disable Shopping Cart Functionality
                                            <span className='d-block'> This will disable ability to book multiple services in one order </span>
                                        </label>
                                    </div>
                                </div>
                                <div className='col-lg-12 spo-none01'>
                                    <div className="form-check form-switch ">
                                        <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked02"/>
                                        <label className="form-check-label" htmlFor='flexSwitchCheckChecked02'>
                                            Reset Presets When Adding New Item
                                            <span className='d-block'> This will reset presets settings when adding new item </span>
                                        </label>
                                    </div>
                                </div>
                                
                            </div>
                            
                        </div>
                     </div>
                 </div>
             </div>
             <div className='comon-tops-sets w-100'>
                       <h2 className='cm-head'> Invoice Settings </h2>
             </div>
             <div className='inputs-div01 cm-style01 w-100 d-block'>
                  <div className='row align-items-start'>
                     <div className='col-3'>
                          <p> Invoice Data </p>
                     </div>
                     <div className='col-9 pt-lg-0'>
                        <div className='right-offections'>
                            <div className='row gy-4 mt-0'>
                                <div className='col-lg-12'>
                                        <div className='position-relative w-100'>
                                          <div className='row'>
                                            <div className='col-lg-5'>
                                                <div className='img-hovers-div01 text-center d-flex align-items-center justify-content-center'>
                                                 
                                                        <Image src={previewImage} alt="Preview" width={200} height={61} />
                                                    
                                                </div>
                                            </div>
                                            <div className='col-lg-7'>
                                                <div className="w-100">
                                                  <label htmlFor="formFile" className="form-label">Upload Company Logo </label>
                                                  <input className="form-control" type="file" onChange={handleImageChange} id="formFile"/>
                                                </div>
                                            </div>
                                            
                                            
                                          </div>
                                        <div>
                                        
                                       </div>
                                        
                                    </div>
                                        

                                        
                                 </div>
                                <div className='col-lg-4'>
                                    <div className='form-group'>
                                        <label className='form-label'> Company Name </label>
                                        <input type='text' name='eari' className='form-control' placeholder='Company Name' />
                                    </div>
                                </div>
                                <div className='col-lg-4'>
                                    <div className='form-group'>
                                        <label className='form-label'> VAT Number/Tax ID </label>
                                        <input type='text' name='latest' className='form-control' placeholder='VAT Number/Tax ID' />
                                    </div>
                                </div>
                                <div className='col-lg-4'>
                                    <div className='form-group'>
                                        <label className='form-label'> Number Prefix </label>
                                        <input type='text' name='latest' className='form-control' placeholder='INV-' />
                                    </div>
                                </div>
                                <div className='col-lg-12'>
                                    <div className='form-group'>
                                        <label className='form-label'> Bill From </label>
                                         <textarea className="form-control nem-textr"></textarea>
                             
                                    </div>
                                </div>
                                <div className='col-lg-12'>
                                    <div className='form-group'>
                                        <label className='form-label'> Bill To </label>
                                       <textarea className="form-control nem-textr"></textarea>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                     </div>
                  </div>

                  <div className='row align-items-start'>
                     <div className='col-3'>
                          <p> Email Invoice </p>
                     </div>
                     <div className='col-9 pt-lg-0'>
                        <div className='right-offections'>
                            <div className='row gy-4 mt-0'>
                                <div className='col-lg-12 '>
                                     <p className="bg-retricstions01 d-flex align-items-center"> This subject and content will be used 
                                        when invoice is being emailed.  <Link href='/' className='btn linkj'> <IoMdInformationCircleOutline /> Show Available Variables </Link> </p>
                                    
                                </div>
                                <div className='col-lg-12'>
                                    <div className='form-group'>
                                         <label className="form-label"> Subject </label>
                                         <input type='text' name='eari2' className='form-control' placeholder='Your Invoice for Order #{{order_confirmation_code}}' />
                                    </div>
                                </div>
                                <div className='col-lg-12'>
                                    

                                    <ul className="nav genrations01 nav-tabs" id="myTab" role="tablist">
                                          <li className="nav-item" role="presentation">
                                            <button className="nav-link active" id="home-tab" data-bs-toggle="tab" 
                                            data-bs-target="#home" type="button" role="tab" aria-controls="home" 
                                            aria-selected="true">Visual</button>
                                          </li>
                                          <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="profile-tab" data-bs-toggle="tab" 
                                            data-bs-target="#profile" type="button" role="tab" aria-controls="profile" 
                                            aria-selected="false">Code</button>
                                          </li>
                                        
                                        </ul>
                                        <div className="tab-content pt-3" id="myTabContent">
                                            <div className="tab-pane fade show active" id="home" role="tabpanel">
                                               <TextEditor/>
                                            </div>
                                            <div className="tab-pane fade " id="profile" role="tabpanel">
                                               <TextEditor/>
                                            </div>
                                        
                                        
                                        </div>
                                </div>
                               
                            </div>
                            
                        </div>
                     </div>
                  </div>
             </div>

             <div className='comon-tops-sets w-100'>
                 <h2 className='cm-head'> Other Settings </h2>
             </div>
             <div className='inputs-div01 cm-style01 w-100 d-block'>
                  <div className='row align-items-start'>
                     <div className='col-3'>
                          <p> Business Information </p>
                     </div>
                     <div className='col-9'>
                           <div className='right-offections'>
                            <div className='row gy-4 mt-0'>
                                
                                <div className='col-lg-12 mt-0'>
                                        <div className='position-relative w-100'>
                                          <div className='row'>
                                            <div className='col-lg-5'>
                                                <div className='img-hovers-div01 text-center d-flex align-items-center justify-content-center'>
                                                 
                                                        <Image src={previewImage} alt="Preview" width={200} height={61} />
                                                    
                                                </div>
                                            </div>
                                            <div className='col-lg-7'>
                                                <div className="w-100">
                                                  <label htmlFor="formFile" className="form-label">Upload Company Logo </label>
                                                  <input className="form-control" type="file" onChange={handleImageChange} id="formFile"/>
                                                </div>
                                            </div>
                                            
                                            
                                          </div>
                                        <div>
                                        
                                       </div>
                                        
                                    </div>
                                        

                                        
                                 </div>
                                <div className='col-lg-4'>
                                    <div className='form-group'>
                                        <label className='form-label'> Company Name </label>
                                        <input type='text' name='eari' className='form-control' placeholder='Company Name' />
                                    </div>
                                </div>
                                <div className='col-lg-4'>
                                    <div className='form-group'>
                                        <label className='form-label'> Business Phone </label>
                                        <input type='text' name='latest' className='form-control' placeholder='Business Phone' />
                                    </div>
                                </div>
                                <div className='col-lg-4'>
                                    <div className='form-group'>
                                        <label className='form-label'> Business Address </label>
                                        <input type='text' name='latest' className='form-control' placeholder='Business Address' />
                                    </div>
                                </div>
                               
                            </div>
                            
                        </div>
                     </div>
                  </div>
                  <div className='row align-items-start'>
                     <div className='col-3'>
                          <p> Calendar Settings </p>
                     </div>
                     <div className='col-9'>
                           <div className='right-offections'>
                            <div className='row gy-4 mt-0'>

                                <div className='col-lg-12 mt-0'>
                                    <div className='form-group'>
                                        <label className='form-label'> Minimum height of a daily calendar (in pixels) </label>
                                        <input type='text' name='eari' className='form-control' placeholder='700' />
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <p className="bg-retricstions01"> You can use variables in your booking template, they will be replaced with a value for the booking.  
                                        <Link className="btn ps-lg-0 linkj" href="/"> <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                         <path d="M256 90c44.3 0 86 17.3 117.4 48.6C404.7 170 422 211.7 422 256s-17.3 86-48.6 117.4C342 404.7 300.3 422 256 422s-86-17.3-117.4-48.6C107.3 342 90 300.3 90 256s17.3-86 48.6-117.4C170 107.3 211.7 90 256 90m0-42C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z"></path><path d="M277 360h-42V235h42v125zm0-166h-42v-42h42v42z"></path></svg> 
                                            Show Available Variables
                                         </Link> 
                                    </p>
                                </div>
                                <div className="col-lg-12">
                                    <div className='form-group'>
                                        <label className='form-label'> Booking tile information to display on calendar </label>
                                        <input type='text' name='eari' className='form-control' placeholder='{{service_name}}' />
                                    </div>
                                </div>
                               
                               
                            </div>
                            
                        </div>
                     </div>
                  </div>

                  <div className='row align-items-start'>
                     <div className='col-3'>
                          <p> Conversion Tracking </p>
                     </div>
                     <div className='col-9'>
                           <div className='right-offections'>
                            <div className='row gy-4 mt-0'>

                                  
                                <div className='col-lg-12 mt-0'>
                                    <div className='form-group'>
                                        <label className='form-label'> Minimum height of a daily calendar (in pixels) </label>
                                        <input type='text' name='eari' className='form-control' placeholder='700' />
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <p className="bg-retricstions01 "> You can include some javascript or html that will be appended to the confirmation step. For example you can track ad conversions by triggering a tracking code or a facebook pixel. You can use these variables
                                         within your code. Click on the variable to copy.  
                                        
                                    </p>
                                </div>
                                <div className="col-lg-12">
                                    <div className='row '>
                                        <div className='col-lg-5'>
                                            <div className='bg-white oder-div01'>
                                                 <ul>
                                                    <li className='d-flex align-items-center'>
                                                      <span> Order ID#: </span>
                                                      <Link href='/'>  <code>{'{{location_ids}}'}</code> </Link>
                                                    </li>
                                                    <li className='d-flex align-items-center'>
                                                      <span> Customer ID#: </span>
                                                      <Link href='/'> <code>{'{{customer_id}}'}</code>  </Link>
                                                    </li>
                                                    <li className='d-flex align-items-center'>
                                                      <span> Order Total: </span>
                                                      <Link href='/'>  <code>{'{{order_total}}'}</code> </Link>
                                                    </li>
                                                    <li className='d-flex align-items-center'>
                                                      <span> Service IDs#: </span>
                                                      <Link href='/'>  <code>{'{{service_ids}}'}</code> </Link>
                                                    </li>
                                                    <li className='d-flex align-items-center'>
                                                      <span> Agent IDs#: </span>
                                                      <Link href='/'> <code>{'{{agent_ids}}'}</code>  </Link>
                                                    </li>
                                                    <li className='d-flex align-items-center'>
                                                      <span> Bundle IDs#: </span>
                                                      <Link href='/'> <code>{'{{bundle_ids}}'}</code> </Link>
                                                    </li>
                                                    <li className='d-flex align-items-center'>
                                                      <span> Location IDs#: </span>
                                                      <Link href='/'>  <code>{'{{blocation_ids}}'}</code> </Link>
                                                    </li>
                                                 </ul>
                                            </div>
                                        </div>
                                        <div className='col-lg-7'>
                                            <textarea className='form-control min-enter' placeholder='Enter Tracking code here'></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className='form-group'>
                                        <label className='form-label'> Booking tile information to display on calendar </label>
                                        <input type='text' name='eari' className='form-control' placeholder='{{service_name}}' />
                                    </div>
                                </div>
                               
                               
                            </div>
                            
                        </div>
                     </div>
                  </div>

                   <div className='row align-items-start'>
                     <div className='col-3'>
                          <p> Data Tables </p>
                     </div>
                     <div className='col-9'>
                           <div className='right-offections'>
                            <div className='row gy-4 mt-0'>

                                  
                                <div className='col-lg-8 mt-0'>
                                   
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault052"/>
                                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault052">Allow non admins to download table data as csv
                                            <span className='d-block'>
                                                 Only admins will be able to download table data as csv
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-4 mt-0">
                                    <div className='form-group'>
                                        <label className='form-label'> Number of records per page</label>
                                        <Select options={numberss}
                                            name="numbersd"
                                           className="basic-multi-select" />
                                    </div>
                                     
                                </div>
                                
                            </div>
                            
                        </div>
                     </div>
                   </div>

                   <div className='row align-items-start'>
                     <div className='col-3'>
                          <p> Export/Import </p>
                     </div>
                     <div className='col-9 mt-0'>
                           <div className='right-offections'>
                              
                              <Link href='/' className='btn extn-btn'> <TbExternalLink /> Export Data </Link>
                              <Link href='/' className='btn extn-btn ms-4'> <PiDownloadSimpleBold /> Import Data </Link>
                            
                           </div>
                     </div>
                   </div>
                   <div className='row align-items-start'>
                     <div className='col-3'>
                          <p> Google Places API </p>
                     </div>
                     <div className='col-9 mt-0'>
                           <div className='right-offections'>
                              <div className='col-lg-12'>
                                  <p className="bg-retricstions01"> 
                                    In order for address autocomplete to work, you need an API key. To learn how to create an API key for Google Places API 
                                    <Link className="btn ps-lg-0 linkj" href="/"> 
                                      click here
                                    </Link></p>
                              </div>
                              <div className='col-lg-12'>
                                  <div className='row row-cols-1 row-cols-lg-2'>
                                      <div className='col'>
                                           <div className='form-group'>
                                                <label className='form-label'> Google Places API key </label>
                                                <input type='text' className='form-control' placeholder='Google Places API key'/>
                                            </div>
                                      </div>
                                      <div className='col'>
                                           <div className='form-group'>
                                                <label className='form-label'> Country Restriction </label>
                                                <Select options={countryl}
                                                    name="numbersd"
                                                className="basic-multi-select" />
                                            </div>
                                      </div>
                                  </div>
                              </div>

                             
                            
                           </div>
                      </div>
                   </div>


             </div>
          </div> 
        </>
    );
    
}

export default GeneralSettings;
