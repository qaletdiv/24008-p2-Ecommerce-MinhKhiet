import React from 'react';
import Link from 'next/link';
import { assets } from '../../../backend/assets/assets';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import '../../styles/SellerSidebar.css';

const SideBar = () => {
    const pathname = usePathname()
    const menuItems = [
        { name: 'Add Product', path: '/seller', icon: assets.add_icon },
        { name: 'Product List', path: '/seller/product-list', icon: assets.product_list_icon },
        { name: 'Orders', path: '/seller/orders', icon: assets.order_icon },
    ];

    return (
        <div className='seller-sidebar-container'>
            {menuItems.map((item) => {

                const isActive = pathname === item.path;

                return (
                    <Link href={item.path} key={item.name} passHref>
                        <div
                            className={
                                `seller-sidebar-item ${
                                    isActive ? "active" : ""
                                }`
                            }
                        >
                            <Image
                                src={item.icon}
                                alt={`${item.name.toLowerCase()}_icon`}
                                className="seller-sidebar-icon"
                                width={20}
                                height={20}
                            />
                            <p className='seller-sidebar-text'>{item.name}</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default SideBar;
