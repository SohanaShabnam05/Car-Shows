import { CarProps, FilterProps } from "@/types";

export const calculateCarRent = (city_mpg: number, year: number) => {
	const basePricePerDay = 50; // Base rental price per day in dollars
	const mileageFactor = 0.1; // Additional rate per mile driven
	const ageFactor = 0.05; // Additional rate per year of vehicle age

	// Calculate additional rate based on mileage and age
	const mileageRate = city_mpg * mileageFactor;
	const ageRate = (new Date().getFullYear() - year) * ageFactor;

	// Calculate total rental rate per day
	const rentalRatePerDay = basePricePerDay + mileageRate + ageRate;

	return rentalRatePerDay.toFixed(0);
};

export const updateSearchParams = (type: string, value: string) => {
	// Get the current URL search params
	const searchParams = new URLSearchParams(window.location.search);

	// Set the specified search parameter to the given value
	searchParams.set(type, value);

	// Set the specified search parameter to the given value
	const newPathname = `${window.location.pathname}?${searchParams.toString()}`;

	return newPathname;
};

export const deleteSearchParams = (type: string) => {
	// Set the specified search parameter to the given value
	const newSearchParams = new URLSearchParams(window.location.search);

	// Delete the specified search parameter
	newSearchParams.delete(type.toLocaleLowerCase());

	// Construct the updated URL pathname with the deleted search parameter
	const newPathname = `${
		window.location.pathname
	}?${newSearchParams.toString()}`;

	return newPathname;
};

export async function fetchCars(filters: FilterProps) {
    const { manufacturer, year, model, limit, fuel } = filters;

    // Construct query parameters dynamically
    const queryParams = new URLSearchParams();

    if (manufacturer) queryParams.append("make", manufacturer);
    if (year) queryParams.append("year", year.toString());
    if (model) queryParams.append("model", model);
    if (limit) queryParams.append("limit", limit.toString());
    if (fuel) queryParams.append("fuel_type", fuel);


    const apiUrl = `https://cars-by-api-ninjas.p.rapidapi.com/v1/cars${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    const headers: HeadersInit = {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY || "",
        "X-RapidAPI-Host": "cars-by-api-ninjas.p.rapidapi.com",
    };

    try {
        const response = await fetch(apiUrl, { headers });


        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }
        const result = await response.json();


        if (Array.isArray(result) && result.length === 0) {
            console.warn("Empty response received. Fetching general data...");
            return fetchCars({ manufacturer: "Toyota", limit: 10 }); // Default general call
        }

        return result;
    } catch (error) {
        console.error("Error fetching car data:", error);
        return null;
    }
}


export const generateCarImageUrl = (car: CarProps, angle?: string) => {
	const url = new URL("https://cdn.imagin.studio/getimage");
	const { make, model, year } = car;

	url.searchParams.append(
		"customer",
		process.env.NEXT_PUBLIC_IMAGIN_API_KEY || ""
	);
	url.searchParams.append("make", make);
	url.searchParams.append("modelFamily", model.split(" ")[0]);
	url.searchParams.append("zoomType", "fullscreen");
	url.searchParams.append("modelYear", `${year}`);
	// url.searchParams.append('zoomLevel', zoomLevel);
	url.searchParams.append("angle", `${angle}`);

	return `${url}`;
};
