'use client';

import { useState } from 'react';

import { FaArrowRightLong } from "react-icons/fa6"

const Payments = () => {

   const [isVisible, setIsVisible] = useState(false);

   const toggleDiv = () => {
    setIsVisible((prev) => !prev);
   };

    return(
        <>
         <section className='d-block w-100'>
                <div className='wrapper'>
                    <div className='stripe-container'>
                        <div className='os-section-header'>
                            <h2 className='payment-heading cm-head'> Payment Process</h2>
 
                        </div>
 
                        <div className='payments-stip w-100'>
                            <div className='stripe'>
                                <div className='stripe-radio'>

                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked" onClick={toggleDiv} />
                                    </div>
    
                                    <img src="https://latepoint.appointmentstudio.com/wp-content/plugins/latepoint/public/images/processor-stripe-connect.png" alt="" id='stripe-logo' />
                                </div>
                                <div id='stripe-connect'>
    
                                    <h4>Stripe Connect</h4>
                                </div>
                            </div> 

                             {isVisible && (
                            <div className="w-100 d-block payments-nm-crm">
                                <div className='quoter d-block w-100'>
                                   <div className='row'>
                                        <div className='col-3'>
                                            <p className='m-0'> Connect (Live) </p>
                                        </div>
                                        <div className='col-9'>
                                            <button type='button' className='btn btn-links'> Start Connecting <FaArrowRightLong/> </button>
                                        </div>
                                    </div>
                                </div>

                                <div className='quoter d-block w-100'>
                                   <div className='row'>
                                        <div className='col-3'>
                                            <p className='m-0'> Connect (Dev) </p>
                                        </div>
                                        <div className='col-9'>
                                            <button type='button' className='btn btn-links'> Start Connecting <FaArrowRightLong/> </button>
                                        </div>
                                    </div>
                                </div>
                                <div className='quoter d-block w-100'>
                                   <div className='row'>
                                        <div className='col-3'>
                                            <p className='m-0'> Other Settings </p>
                                        </div>
                                        <div className='col-9'>
                                             <div className='row row-cols-1 row-cols-lg-2'>
                                                  <div className='col'>
                                                      <div className='form-group'>
                                                          <label className='mb-2'> Country </label>
                                                          <select class="form-select" aria-label="Default select example">
                                                            <option selected>United State</option>
                                                            <option value="1">India</option>
                                                            <option value="2">Japan</option>
                                                            <option value="3">Franch</option>
                                                           </select>
                                                      </div>
                                                  </div>
                                                  <div className='col'>
                                                      <div className='form-group'>
                                                          <label className='mb-2'> Currency Code </label>

                                                            <select name="name" class="form-select">
                                                                <option value="usd" selected="">United States Dollar</option>
                                                                <option value="aed">United Arab Emirates Dirham</option>
                                                                <option value="afn">Afghan Afghani</option>
                                                                <option value="all">Albanian Lek</option>
                                                                <option value="amd">Armenian Dram</option>
                                                                <option value="ang">Netherlands Antillean Guilder</option>
                                                                <option value="aoa">Angolan Kwanza</option>
                                                                <option value="ars">Argentine Peso</option>
                                                                <option value="aud">Australian Dollar</option>
                                                                <option value="awg">Aruban Florin</option>
                                                                <option value="azn">Azerbaijani Manat</option>
                                                                <option value="bam">Bosnia-Herzegovina Convertible Mark</option>
                                                                <option value="bbd">Barbadian Dollar</option>
                                                                <option value="bdt">Bangladeshi Taka</option>
                                                                <option value="bgn">Bulgarian Lev</option>
                                                                <option value="bif">Burundian Franc</option>
                                                                <option value="bmd">Bermudian Dollar</option>
                                                                <option value="bnd">Brunei Dollar</option>
                                                                <option value="bob">Bolivian Boliviano</option>
                                                                <option value="brl">Brazilian Real</option>
                                                                <option value="bsd">Bahamian Dollar</option>
                                                                <option value="bwp">Botswana Pula</option>
                                                                <option value="bzd">Belize Dollar</option>
                                                                <option value="cad">Canadian Dollar</option>
                                                                <option value="cdf">Congolese Franc</option>
                                                                <option value="chf">Swiss Franc</option>
                                                                <option value="clp">Chilean Peso</option>
                                                                <option value="cny">Chinese Yuan</option>
                                                                <option value="cop">Colombian Peso</option>
                                                                <option value="crc">Costa Rican Colón</option>
                                                                <option value="cve">Cape Verdean Escudo</option>
                                                                <option value="czk">Czech Koruna</option>
                                                                <option value="djf">Djiboutian Franc</option>
                                                                <option value="dkk">Danish Krone</option>
                                                                <option value="dop">Dominican Peso</option>
                                                                <option value="dzd">Algerian Dinar</option>
                                                                <option value="egp">Egyptian Pound</option>
                                                                <option value="etb">Ethiopian Birr</option>
                                                                <option value="eur">Euro</option>
                                                                <option value="fjd">Fijian Dollar</option>
                                                                <option value="fkp">Falkland Islands Pound</option>
                                                                <option value="gbp">British Pound Sterling</option>
                                                                <option value="gel">Georgian Lari</option>
                                                                <option value="gip">Gibraltar Pound</option>
                                                                <option value="gmd">Gambian Dalasi</option>
                                                                <option value="gnf">Guinean Franc</option>
                                                                <option value="gtq">Guatemalan Quetzal</option>
                                                                <option value="gyd">Guyanese Dollar</option>
                                                                <option value="hkd">Hong Kong Dollar</option>
                                                                <option value="hnl">Honduran Lempira</option>
                                                                <option value="hrk">Croatian Kuna</option>
                                                                <option value="htg">Haitian Gourde</option>
                                                                <option value="huf">Hungarian Forint</option>
                                                                <option value="idr">Indonesian Rupiah</option>
                                                                <option value="ils">Israeli New Shekel</option>
                                                                <option value="inr">Indian Rupee</option>
                                                                <option value="isk">Icelandic Króna</option>
                                                                <option value="jmd">Jamaican Dollar</option>
                                                                <option value="jpy">Japanese Yen</option>
                                                                <option value="kes">Kenyan Shilling</option>
                                                                <option value="kgs">Kyrgyzstani Som</option>
                                                                <option value="khr">Cambodian Riel</option>
                                                                <option value="kmf">Comorian Franc</option>
                                                                <option value="krw">South Korean Won</option>
                                                                <option value="kyd">Cayman Islands Dollar</option>
                                                                <option value="kzt">Kazakhstani Tenge</option>
                                                                <option value="lak">Lao Kip</option>
                                                                <option value="lbp">Lebanese Pound</option>
                                                                <option value="lkr">Sri Lankan Rupee</option>
                                                                <option value="lrd">Liberian Dollar</option>
                                                                <option value="lsl">Lesotho Loti</option>
                                                                <option value="mad">Moroccan Dirham</option>
                                                                <option value="mdl">Moldovan Leu</option>
                                                                <option value="mga">Malagasy Ariary</option>
                                                                <option value="mkd">Macedonian Denar</option>
                                                                <option value="mmk">Myanmar Kyat</option>
                                                                <option value="mnt">Mongolian Tögrög</option>
                                                                <option value="mop">Macanese Pataca</option>
                                                                <option value="mro">Mauritanian Ouguiya (pre-2018)</option>
                                                                <option value="mur">Mauritian Rupee</option>
                                                                <option value="mvr">Maldivian Rufiyaa</option>
                                                                <option value="mwk">Malawian Kwacha</option>
                                                                <option value="mxn">Mexican Peso</option>
                                                                <option value="myr">Malaysian Ringgit</option>
                                                                <option value="mzn">Mozambican Metical</option>
                                                                <option value="nad">Namibian Dollar</option>
                                                                <option value="ngn">Nigerian Naira</option>
                                                                <option value="nio">Nicaraguan Córdoba</option>
                                                                <option value="nok">Norwegian Krone</option>
                                                                <option value="npr">Nepalese Rupee</option>
                                                                <option value="nzd">New Zealand Dollar</option>
                                                                <option value="pab">Panamanian Balboa</option>
                                                                <option value="pen">Peruvian Sol</option>
                                                                <option value="pgk">Papua New Guinean Kina</option>
                                                                <option value="php">Philippine Peso</option>
                                                                <option value="pkr">Pakistani Rupee</option>
                                                                <option value="pln">Polish Złoty</option>
                                                                <option value="pyg">Paraguayan Guarani</option>
                                                                <option value="qar">Qatari Riyal</option>
                                                                <option value="ron">Romanian Leu</option>
                                                                <option value="rsd">Serbian Dinar</option>
                                                                <option value="rub">Russian Ruble</option>
                                                                <option value="rwf">Rwandan Franc</option>
                                                                <option value="sar">Saudi Riyal</option>
                                                                <option value="sbd">Solomon Islands Dollar</option>
                                                                <option value="scr">Seychellois Rupee</option>
                                                                <option value="sek">Swedish Krona</option>
                                                                <option value="sgd">Singapore Dollar</option>
                                                                <option value="shp">Saint Helena Pound</option>
                                                                <option value="sll">Sierra Leonean Leone</option>
                                                                <option value="sos">Somali Shilling</option>
                                                                <option value="srd">Surinamese Dollar</option>
                                                                <option value="std">São Tome and Príncipe Dobra (pre-2018)</option>
                                                                <option value="svc">Salvadoran Colón</option>
                                                                <option value="szl">Swazi Lilangeni</option>
                                                                <option value="thb">Thai Baht</option>
                                                                <option value="tjs">Tajikistani Somoni</option>
                                                                <option value="top">Tongan Paanga</option>
                                                                <option value="try">Turkish Lira</option>
                                                                <option value="ttd">Trinidad and Tobago Dollar</option>
                                                                <option value="twd">New Taiwan Dollar</option>
                                                                <option value="tzs">Tanzanian Shilling</option>
                                                                <option value="uah">Ukrainian Hryvnia</option>
                                                                <option value="ugx">Ugandan Shilling</option>
                                                                <option value="uyu">Uruguayan Peso</option>
                                                                <option value="uzs">Uzbekistani Som</option>
                                                                <option value="vnd">Vietnamese Đồng</option>
                                                                <option value="vuv">Vanuatu Vatu</option>
                                                                <option value="wst">Samoan Tālā</option>
                                                                <option value="xaf">Central African CFA Franc</option>
                                                                <option value="xcd">East Caribbean Dollar</option>
                                                                <option value="xof">West African CFA Franc</option>
                                                                <option value="xpf">CFP Franc</option>
                                                                <option value="yer">Yemeni Rial</option>
                                                                <option value="zar">South African Rand</option>
                                                                <option value="zmw">Zambian Kwacha</option>
                                                            </select>
                                                      </div>
                                                  </div>
                                             </div>
                                        </div>
                                    </div>
                                </div>
                                
                               

                               
                               
                            </div>

                            
                          )}
                            
                        </div>

                        
 
                        <h2 className='payment-heading cm-head'> Others Settings </h2>
                        <div className='payments-stip w-100 payou-list01'>
                            <div className='table-row-two'>
                                <div className='row'>
                                  <div className='col-3'>
                                    <div className='table-row-two-left ' id="environment-br">Environment</div>
                                  </div>
                                  <div className='col-9'>
                                    <div className='table-row-two-right'>
                                        <select name="environment" className="form-select" id="environment">
                                            <option value="volvo">Volvo</option>
                                            <option value="saab">Saab</option>
                                            <option value="opel">Opel</option>
                                            <option value="audi">Audi</option>
                                        </select>
                                    </div>
                                  </div>
                                </div>
                               
                                
                                
                                
                            </div>

                            <div className='table-row-two'>
                                <div className='row'>
                                  <div className='col-3'>
                                    <div className='table-row-two-left ' id="environment-br">
                                        Local Payments </div>
                                  </div>
                                  <div className='col-9'>
                                     <div className='table-row-two-right'>
                                        <div className='checkbox-text'>
                                            
                                            <div className="form-check form-switch">
                                               <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault1"/>                                               
                                            </div>
                                            <div>
                                              <p className='mt-0 mb-0'>Allow Paying Locally</p>
                                              <p className='mt-2'>Show Pay Later payment option</p>
                                            </div>
                                        </div>
                                        
                                     </div>
                                  </div>
                                </div>
                               
                                
                                
                                
                            </div>
    
                        </div>
                        <div className="button-container">
                            <button className="save-btn">Save Settings</button>
                        </div>
 
 
                    </div>
 
                </div>
 
            </section>
        </>
    );
    
}

export default Payments;
