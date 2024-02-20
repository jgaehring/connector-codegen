// External
import { Semanticable } from "@virtual-assembly/semantizer";

// Static
import IConnectorFactory from "./IConnectorFactory.js";
import IGetterOptions from "./IGetterOptions.js";
import IConnectorExportOptions from "./IConnectorExportOptions.js";
import IConnectorImportOptions from "./IConnectorImportOptions.js";

// Generated Code
import IAddress from "./IAddress";
import IAgent from "./IAgent";
import IAllergenCharacteristic from "./IAllergenCharacteristic";
import IAllergenDimension from "./IAllergenDimension";
import ICatalog from "./ICatalog";
import ICatalogItem from "./ICatalogItem";
import ICertification from "./ICertification";
import IClaim from "./IClaim";
import ICustomerCategory from "./ICustomerCategory";
import IEnterprise from "./IEnterprise";
import IGeographicalOrigin from "./IGeographicalOrigin";
import INatureOrigin from "./INatureOrigin";
import INutrientCharacteristic from "./INutrientCharacteristic";
import INutrientDimension from "./INutrientDimension";
import IOffer from "./IOffer";
import IOrder from "./IOrder";
import IOrderLine from "./IOrderLine";
import IPartOrigin from "./IPartOrigin";
import IPerson from "./IPerson";
import IPhysicalCharacteristic from "./IPhysicalCharacteristic";
import IPhysicalDimension from "./IPhysicalDimension";
import IPrice from "./IPrice";
import IProductType from "./IProductType";
import IQuantity from "./IQuantity";
import ISaleSession from "./ISaleSession";
import ISuppliedProduct from "./ISuppliedProduct";
import IUnit from "./IUnit";

export default interface IConnector {
    
    createAddress(parameters: {doNotStore?: boolean, semanticId?: string, other?: Semanticable, street?: string, postalCode?: string, city?: string, country?: string}): IAddress;
    createAllergenCharacteristic(parameters: {other?: Semanticable, unit?: IUnit, value?: number, allergenDimension?: IAllergenDimension}): IAllergenCharacteristic;
    createCatalog(parameters: {doNotStore?: boolean, semanticId?: string, other?: Semanticable, maintainers?: IEnterprise[], items?: ICatalogItem[]}): ICatalog;
    createCatalogItem(parameters: {doNotStore?: boolean, semanticId?: string, other?: Semanticable, product?: ISuppliedProduct, sku?: string, stockLimitation?: number, offers?: IOffer[], catalogs?: ICatalog[]}): ICatalogItem;
    createCustomerCategory(parameters: {doNotStore?: boolean, semanticId?: string, other?: Semanticable, description?: string}): ICustomerCategory;
    createEnterprise(parameters: {doNotStore?: boolean, semanticId?: string, other?: Semanticable, localizations?: IAddress[], description?: string, vatNumber?: string, customerCategories?: ICustomerCategory[], catalogs?: ICatalog[], catalogItems?: ICatalogItem[], suppliedProducts?: ISuppliedProduct[]}): IEnterprise;
    createNutrientCharacteristic(parameters: {other?: Semanticable, unit?: IUnit, value?: number, nutrientDimension?: INutrientDimension}): INutrientCharacteristic;
    createOffer(parameters: {doNotStore?: boolean, semanticId?: string, other?: Semanticable, offeredItem?: ICatalogItem, offeredTo?: ICustomerCategory, price?: IPrice, stockLimitation?: number}): IOffer;
    createOrder(parameters: {doNotStore?: boolean, semanticId?: string, other?: Semanticable, number?: string, date?: string, saleSession?: ISaleSession, client?: IAgent, lines?: IOrderLine[]}): IOrder;
    createOrderLine(parameters: {doNotStore?: boolean, semanticId?: string, other?: Semanticable, quantity?: number, price?: IPrice, offer?: IOffer, order?: IOrder}): IOrderLine;
    createPerson(parameters: {doNotStore?: boolean, semanticId?: string, other?: Semanticable, firstName?: string, lastName?: string, localizations?: IAddress[], organizations?: IEnterprise[]}): IPerson;
    createPhysicalCharacteristic(parameters: {other?: Semanticable, unit?: IUnit, value?: number, physicalDimension?: IPhysicalDimension}): IPhysicalCharacteristic;
    createPrice(parameters: {other?: Semanticable, value?: number, vatRate?: number, unit?: IUnit}): IPrice;
    createQuantity(parameters: {other?: Semanticable, unit?: IUnit, value?: number}): IQuantity;
    createSaleSession(parameters: {doNotStore?: boolean, semanticId?: string, other?: Semanticable, beginDate?: string, endDate?: string, quantity?: number, offers?: IOffer[]}): ISaleSession;
    createSuppliedProduct(parameters: {doNotStore?: boolean, semanticId?: string, other?: Semanticable, name?: string, description?: string, productType?: IProductType, quantity?: IQuantity, alcoholPercentage?: number, lifetime?: string, claims?: IClaim[], usageOrStorageConditions?: string, allergenCharacteristics?: IAllergenCharacteristic[], nutrientCharacteristics?: INutrientCharacteristic[], physicalCharacteristics?: IPhysicalCharacteristic[], geographicalOrigin?: IGeographicalOrigin, catalogItems?: ICatalogItem[], certifications?: ICertification[], natureOrigin?: INatureOrigin[], partOrigin?: IPartOrigin[], totalTheoreticalStock?: number}): ISuppliedProduct;
   
    export(objects: Array<Semanticable>, options?: IConnectorExportOptions): Promise<string>;
    fetch(semanticObjectId: string, options?: IGetterOptions): Promise<Semanticable | undefined>;
    
    // TODO: remove
    getDefaultFactory(): IConnectorFactory;

    import(data: string, options?: IConnectorImportOptions): Promise<Array<Semanticable>>;
    importOne(data: string, options?: IConnectorImportOptions): Promise<Semanticable | undefined>;
    importOneTyped<Type>(data: string, options?: IConnectorImportOptions): Promise<Type | undefined>;
    
    store(semanticObject: Semanticable): void;

}