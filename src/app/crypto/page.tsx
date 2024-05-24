'use client'
import React, { useEffect, useState } from 'react'
import FontAwesome from '../components/FontAwesome'
// for solid icons
import { faRightLong, faLeftLong, faCaretDown, faCaretUp, IconDefinition, faPlus, faSearch, faEye, faTrash } from "@fortawesome/free-solid-svg-icons"
import axios from 'axios';
import Image from 'next/image';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';

export interface QueryParamsI { pageSize: number; page: number; orderDir: string; orderBy: string; search: string }
let apiURL = 'http://localhost:7000/'
const Crypto = () => {

    const [caretIcon, toggleCaretIcon] = useState<IconDefinition[]>([faCaretDown, faCaretDown, faCaretDown, faCaretDown, faCaretDown, faCaretDown, faCaretDown])
    const [queryParams, setQueryParams] = useState<QueryParamsI>({ pageSize: 10, page: 1, orderDir: '', orderBy: '', search: '' })
    const [total, setTotalCount] = useState<number>(0);
    const [cryptos, setCryptos] = useState<any[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [watchlistmodal, setWatchListModal] = useState<boolean[]>(Array(10).fill(false));
    const [watchlist, setWatchlist] = useState<any[]>([]);
    const [watchlistPayload, setWatchListPayload] = useState<any[]>([]);

    const toggleCaret = (index: number, columnName: string) => {
        toggleCaretIcon((prevCaretIcon) => {
            const updatedCaretIcon = [...prevCaretIcon];
            updatedCaretIcon[index] = updatedCaretIcon[index].iconName == 'caret-down' ? faCaretUp : faCaretDown;
            setQueryParams({ ...queryParams, orderBy: columnName, orderDir: updatedCaretIcon[index].iconName == 'caret-down' ? 'DESC' : 'ASC' });
            return updatedCaretIcon;
        })

    }

    const changePage = (page: number) => {
        setQueryParams({ ...queryParams, page: page })
    }

    useEffect(() => {
        axios.get(`${apiURL}crypto?search=${queryParams.search}&page=${queryParams.page}&pageSize=${queryParams.pageSize}&orderBy=${queryParams.orderBy}&orderDir=${queryParams.orderDir}`, {
            headers: {
                "Content-Type": 'application/json',
            }
        }).then((response: any) => {
            setCryptos(response.data)
            setTotalCount(parseInt(response.headers['x-count']))
        }).catch(error => {
            console.log(error);
            toast.error(`Internal Server Error`);
        })
    }, [queryParams])

    const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQueryParams({ ...queryParams, search: e.target.value });
    }

    const addToWatchList = (e: React.ChangeEvent<HTMLFormElement>, code: string, price: string, change_24h: string, index: number) => {
        e.preventDefault();

        const payload = { ...watchlistPayload[index], Code: code };
        console.log(payload);
        if (isNaN(payload.MinPrice) == true || isNaN(payload.MaxPrice) == true) {
            toast.error('Please enter numeric value');
            return;
        }

        axios.post(`${apiURL}watchlist`, JSON.stringify(payload), {
            headers: {
                "Content-Type": 'application/json',
            }
        }).then((response: any) => {
            toast.success(`${code} is added to WatchList.`);
            if (parseFloat(price) <= parseFloat(payload.MinPrice) || parseFloat(price) >= parseFloat(payload.MaxPrice)) {
                toast.success(`${code} is on the move, the Price is ${parseFloat(change_24h) <= 0 ? `down` : `up`} ${change_24h}% in 24 hrs to $${price}`);
            }
        }).catch(error => {
            console.log(error);
            toast.error('Internal Server Error');
        })


    }

    const viewModal = () => {
        axios.get(`${apiURL}watchlist`, {
            headers: {
                "Content-Type": 'application/json',
            }
        }).then((response: any) => {
            setWatchlist(response.data);
        }).catch(error => {
            console.log(error);
            toast.error('Internal Server Error');

        })
        setShowModal(true);


    }

    const deleteWatchList = (id: string) => {
        axios.delete(`${apiURL}watchlist/${id}`, {
            headers: {
                "Content-Type": 'application/json',
            }
        }).then((response: any) => {
            toast.success('Watchlist deleted');
        }).catch(error => {
            console.log(error);
            toast.error('Internal Server Error');

        })

        axios.get(`${apiURL}watchlist`, {
            headers: {
                "Content-Type": 'application/json',
            }
        }).then((response: any) => {
            setWatchlist(response.data);
        }).catch(error => {
            console.log(error)
            toast.error('Internal Server Error');
        })


    }

    const handleWatchListPayloadChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        console.log(index)
        setWatchListPayload((prevState: any) => {
            const updatedState = [...prevState];
            const currentWatchList = updatedState[index];
            updatedState[index] = { ...currentWatchList, [e.target.name]: e.target.value }
            console.log(updatedState)
            return updatedState;
        });
    }

    const handleOpenWatchListModal = (index: number) => {
        console.log(index)
        setWatchListModal((prev) => {
            console.log(prev)
            return prev.map((_, i) => (i === index ? true : false));
        });
    };

    const handleCloseWatchListModal = (index: number) => {
        setWatchListModal((prev) => prev.map((isVisible, i) => (i === index ? false : isVisible)));
    };

    const totalPageToShow = Math.ceil(total / queryParams.pageSize)
    const arr = [];
    for (let i = queryParams.page; i <= totalPageToShow; i++) {
        arr.push(i)
    }

    return (
        <div className="container m-auto flex flex-col justify-center">
            <table className="w-[100%] border-collapse">
                <thead>
                    <tr className="bg-gray-600 text-white text-center border border-gray-500">
                        <th
                            className="uppercase p-[12px]">
                            Rank
                            <button className='ml-2' onClick={() => toggleCaret(0, 'rank')}><FontAwesome icon={caretIcon[0]} /></button>
                        </th>
                        <th
                            className="uppercase p-[12px]">
                            Name
                            <button className='ml-2' onClick={() => toggleCaret(1, 'name')}><FontAwesome icon={caretIcon[1]} /></button>
                        </th>
                        <th
                            className="uppercase p-[12px]">
                            Code
                            <button className='ml-2' onClick={() => toggleCaret(2, 'code')}><FontAwesome icon={caretIcon[2]} /></button>
                        </th>

                        <th
                            className="uppercase p-[12px]">
                            Price
                            <button className='ml-2' onClick={() => toggleCaret(3, 'price')}><FontAwesome icon={caretIcon[3]} /></button>
                        </th>
                        <th
                            className="uppercase p-[12px]">
                            MarketCap
                            <button className='ml-2' onClick={() => toggleCaret(4, 'marketcap')}><FontAwesome icon={caretIcon[4]} /></button>
                        </th>
                        <th
                            className="uppercase p-[12px]">
                            Change_24h
                            <button className='ml-2' onClick={() => toggleCaret(5, 'twentyfourhour')}><FontAwesome icon={caretIcon[5]} /></button>
                        </th>
                        <th
                            className="uppercase p-[12px]">
                            ModifiedDate
                            <button className='ml-2' onClick={() => toggleCaret(6, 'datemodified')}><FontAwesome icon={caretIcon[6]} /></button>
                        </th>
                        <th
                            className="uppercase p-[12px] flex justify-center items-center space-x-2">
                            <FontAwesome icon={faSearch} />
                            <input
                                className="w-full outline-none focus:border-gray-500 text-black" type="text" name="search"
                                id="search" placeholder="Search" value={queryParams.search} onChange={handleSearchFieldChange} />
                            <span onClick={viewModal} className='cursor-pointer'><FontAwesome icon={faEye} />
                                <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
                                    {watchlist.length > 0 ? <table className="w-[100%] border-collapse">
                                        <tr className="bg-gray-600 text-white text-center border border-gray-500">
                                            <th
                                                className="uppercase p-[12px]">
                                                Code
                                            </th>
                                            <th
                                                className="uppercase p-[12px]">
                                                MaxPrice
                                            </th>
                                            <th
                                                className="uppercase p-[12px]">
                                                MinPrice
                                            </th>
                                        </tr>
                                        {watchlist?.map((w, index) => (
                                            <tbody key={index}>
                                                <tr className="text-left hover:bg-gray-300">
                                                    <td className={`flex items-center space-x-2 border border-gray-500 p-[12px]`}><Image src={w.Image} height={10} width={10} alt={'CryptoImage'}></Image> {w.Code} </td>
                                                    <td className={`border border-gray-500 p-[12px]`}>{w.MaxPrice}</td>
                                                    <td className={`border border-gray-500 p-[12px]`}>{w.MinPrice}</td>
                                                    <td className={`border border-gray-500 p-[12px] text-center`}>
                                                        <span
                                                            className="bg-gray-600 text-white rounded-sm p-[5px] hover:cursor-pointer hover:bg-gray-500 ml-[10px]"><FontAwesome icon={faTrash} /><input type="button" value="Delete" onClick={() => deleteWatchList(w.CryptoWatchListId)} /></span>
                                                    </td>
                                                </tr>
                                            </tbody>))}
                                    </table> : 'No watchlist'
                                    }
                                </Modal>
                            </span>
                        </th>
                    </tr>
                </thead>

                {cryptos?.map((c, index) => (
                    <tbody key={index}>
                        <tr className="text-left hover:bg-gray-300">
                            <td className={`border border-gray-500 p-[12px]`}>{c.Rank}</td>
                            <td className={`flex items-center space-x-2 border border-gray-500 p-[12px]`}><Image src={c.Image} height={10} width={10} alt={'CryptoImage'}></Image> {c.CryptoName} </td>
                            <td className={`border border-gray-500 p-[12px]`}>{c.Code}</td>
                            <td className={`border border-gray-500 p-[12px]`}>{parseFloat(c.Price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                            <td className={`border border-gray-500 p-[12px]`}>{parseFloat(c.MarketCap).toLocaleString('en-US')}</td>
                            <td className={`border border-gray-500 p-[12px] text-center`}>{c.Change_24h + '%'}</td>
                            <td className={`border border-gray-500 p-[12px]`}>{c.DateModified}</td>
                            <td className={`border border-gray-500 p-[12px] text-center`}>
                                <span
                                    className="bg-gray-600 text-white rounded-sm p-[5px] hover:cursor-pointer hover:bg-gray-500 ml-[10px]" onClick={() => handleOpenWatchListModal(index)}><FontAwesome icon={faPlus} /><input type="button" value="Add to WatchList" />
                                    <Modal isVisible={watchlistmodal[index]} onClose={() => handleCloseWatchListModal(index)}>
                                        <h1>Add Min and Max Prices of {c.Code}</h1>
                                        <form className="w-full flex flex-col space-y-6" onSubmit={(e: any) => addToWatchList(e, c.Code, c.Price, c.Change_24h, index)}>

                                            <div className="flex items-center space-x-3 space-y-1">
                                                <label className="!ml-[12px]" htmlFor="maxprice">MaxPrice($)</label>
                                                <input className="w-full !mr-[20px] py-[9px] outline-none focus:border-gray-500" name="MaxPrice"
                                                    type="text" placeholder="MaxPrice" onChange={(e) => handleWatchListPayloadChange(e, index)} value={watchlistPayload[index]?.MaxPrice || ''} />
                                            </div>
                                            <div className="flex items-center space-x-3 space-y-1">
                                                <label className="!ml-[12px]" htmlFor="minprice">MinPrice($)</label>
                                                <input className="w-full !mr-[20px] py-[9px] outline-none focus:border-gray-500" name="MinPrice"
                                                    type="text" placeholder="MinPrice" onChange={(e) => handleWatchListPayloadChange(e, index)} value={watchlistPayload[index]?.MinPrice || ''} />
                                            </div>
                                            <div className="w-full">
                                                <input
                                                    className="bg-gray-600 w-full py-[9px] border border-radius-300 text-white rounded-sm hover:cursor-pointer hover:bg-gray-400"
                                                    type="submit" value="Add to WatchList" />
                                            </div>
                                        </form>
                                    </Modal></span>
                            </td>
                        </tr>
                    </tbody>))}
            </table>
            {cryptos?.length > 0 ? (<div className="pagination flex justify-center my-[20px]">
                {queryParams.page - 1 >= 1 ? <span className="border border-gray-600 px-[5px] hover:cursor-pointer hover:bg-gray-600" onClick={() => changePage(queryParams.page - 1)}>
                    <FontAwesome icon={faLeftLong} />
                </span> : <></>}
                <ul className="flex justify-evenly space-x-1">
                    {queryParams.page - 1 >= 1 ? <li className="px-[5px] text-center">...</li> : <></>}
                    {arr.map((num) => (<li key={num} className={`border border-gray-600 px-[5px] hover:cursor-pointer hover:bg-gray-600 ${queryParams.page == num ? "bg-gray-600" : ""}`} onClick={() => changePage(num)}>{num}</li>))}
                    {queryParams.page + 1 <= totalPageToShow ? <li className="px-[5px] text-center">...</li> : <></>}
                </ul>
                {queryParams.page + 1 <= totalPageToShow ? <span className="border border-gray-600 px-[5px] hover:cursor-pointer hover:bg-gray-600" onClick={() => changePage(queryParams.page + 1)}>
                    <FontAwesome icon={faRightLong} />
                </span> : <></>}
            </div>) : <></>
            }
        </div>
    )
}

export default Crypto;