import { gql } from '@apollo/client';

const query = gql`
  query LineProperties($prices: Int) {
    {
    results [
        {
            _id
            title
            type
            roomType
            propertyType
            amenities [
            ]
            bathrooms
            accommodates
            bedrooms
            beds
            timezone
            address {
                city
                country
                full
                lat
                lng
                state 
                street 
            }
            picture {
                thumbnail
                caption
            }
            pictures [
                {
                    original
                    thumbnail
                    caption
                }
            ]
            prices {
                basePrice
                currency
            }
            publicDescription {
                summary
            }
            reviews {
                avg
                total
            }
            tags [ ]
        }
`;