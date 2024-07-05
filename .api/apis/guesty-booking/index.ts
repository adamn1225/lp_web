import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'guesty-booking/1.0.1 (api/6.1.2)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * This call returns the list of listings connected to the requester Booking Engine API
   * instance in Guesty and filtered by given parameters
   *
   * @summary Get all the listings included in the booking engine
   * @throws FetchError<400, types.GetApplicationListingsListResponse400> Bad request
   * @throws FetchError<401, types.GetApplicationListingsListResponse401> Not authorized
   * @throws FetchError<429, types.GetApplicationListingsListResponse429> Too many requests
   */
  getApplicationListingsList(metadata?: types.GetApplicationListingsListMetadataParam): Promise<FetchResponse<200, types.GetApplicationListingsListResponse200>> {
    return this.core.fetch('/api/listings', 'get', metadata);
  }

  /**
   * This call returns a listing by ID
   *
   * @summary Get a specific listing
   * @throws FetchError<400, types.GetApplicationListingResponse400> Bad request
   * @throws FetchError<401, types.GetApplicationListingResponse401> Not authorized
   * @throws FetchError<403, types.GetApplicationListingResponse403> Forbidden
   * @throws FetchError<429, types.GetApplicationListingResponse429> Too many requests
   */
  getApplicationListing(metadata: types.GetApplicationListingMetadataParam): Promise<FetchResponse<200, types.GetApplicationListingResponse200>> {
    return this.core.fetch('/api/listings/{listingId}', 'get', metadata);
  }

  /**
   * Get a list of listings according to their availability on selected dates. 
   * ## Deprecation notice:
   *    **This endpoint will be deprecated in the next months. We suggest using 'Get
   * listings' endpoint instead (you won't have any capability missing) -
   * https://booking-api-docs.guesty.com/reference/getapplicationlistingslist**
   *
   *
   * @summary Get listings by availability
   * @throws FetchError<400, types.GetAvailableListingsResponse400> Bad request
   * @throws FetchError<401, types.GetAvailableListingsResponse401> Not authorized
   * @throws FetchError<429, types.GetAvailableListingsResponse429> Too many requests
   */
  getAvailableListings(metadata: types.GetAvailableListingsMetadataParam): Promise<FetchResponse<200, types.GetAvailableListingsResponse200>> {
    return this.core.fetch('/api/listings/availability', 'get', metadata);
  }

  /**
   * Returns a list of all the cities countries and states related to the booking engine
   * listings
   *
   * @summary Get list of cities
   * @throws FetchError<400, types.GetCitiesResponse400> Bad request
   * @throws FetchError<401, types.GetCitiesResponse401> Not authorized
   * @throws FetchError<429, types.GetCitiesResponse429> Too many requests
   */
  getCities(metadata?: types.GetCitiesMetadataParam): Promise<FetchResponse<200, types.GetCitiesResponse200>> {
    return this.core.fetch('/api/listings/cities', 'get', metadata);
  }

  /**
   * Return a listing calendar for period
   *
   * @summary Get listing availability calendar
   * @throws FetchError<400, types.GetCalendarByListingIdResponse400> Bad request
   * @throws FetchError<401, types.GetCalendarByListingIdResponse401> Not authorized
   * @throws FetchError<403, types.GetCalendarByListingIdResponse403> Forbidden
   * @throws FetchError<429, types.GetCalendarByListingIdResponse429> Too many requests
   */
  getCalendarByListingId(metadata: types.GetCalendarByListingIdMetadataParam): Promise<FetchResponse<200, types.GetCalendarByListingIdResponse200>> {
    return this.core.fetch('/api/listings/{listingId}/calendar', 'get', metadata);
  }

  /**
   * Return a payment provider
   *
   * @summary Get listing's payment provider
   * @throws FetchError<400, types.GetPaymentProviderByListingIdResponse400> Bad request
   * @throws FetchError<401, types.GetPaymentProviderByListingIdResponse401> Not authorized
   * @throws FetchError<403, types.GetPaymentProviderByListingIdResponse403> Forbidden
   * @throws FetchError<429, types.GetPaymentProviderByListingIdResponse429> Too many requests
   */
  getPaymentProviderByListingId(metadata: types.GetPaymentProviderByListingIdMetadataParam): Promise<FetchResponse<200, types.GetPaymentProviderByListingIdResponse200>> {
    return this.core.fetch('/api/listings/{listingId}/payment-provider', 'get', metadata);
  }

  /**
   * Create a reservation. Pre-SCA Stripe tokens (starting with `tok_...`) are NOT SUPPORTED.
   * The API supports only Stripe SCA tokens (starting with `pm_...`)
   * ## Deprecation notice:
   *    **This endpoint will be deprecated in the next months. We recommend to use
   * ‘Reservation quote’ endpoints instead.**
   *
   *
   * @summary Create a reservation
   * @throws FetchError<400, types.CreateRerservationResponse400> Bad request
   * @throws FetchError<401, types.CreateRerservationResponse401> Not authorized
   * @throws FetchError<403, types.CreateRerservationResponse403> Forbidden
   * @throws FetchError<429, types.CreateRerservationResponse429> Too many requests
   */
  createRerservation(body?: types.CreateRerservationBodyParam): Promise<FetchResponse<200, types.CreateRerservationResponse200>> {
    return this.core.fetch('/api/reservations', 'post', body);
  }

  /**
   * Calculate and and get full price breakdown for a specific reservation details
   * ## Deprecation notice:
   *    **This endpoint will be deprecated in the next months. We recommend to use
   * ‘Reservation quote’ endpoints instead.**
   *
   *
   * @summary Get precalculated reservation price breakdown
   * @throws FetchError<400, types.CalculateReservationMoneyResponse400> Bad request
   * @throws FetchError<401, types.CalculateReservationMoneyResponse401> Not authorized
   * @throws FetchError<403, types.CalculateReservationMoneyResponse403> Forbidden
   * @throws FetchError<429, types.CalculateReservationMoneyResponse429> Too many requests
   */
  calculateReservationMoney(metadata: types.CalculateReservationMoneyMetadataParam): Promise<FetchResponse<200, types.CalculateReservationMoneyResponse200>> {
    return this.core.fetch('/api/reservations/money', 'get', metadata);
  }

  /**
   * This call returns the reservation by ID
   * ## Deprecation notice:
   *    **This endpoint will be deprecated in the next months. We recommend to use
   * ‘Reservation quote’ endpoints instead.**
   *
   *
   * @summary Get booking engine reservation by Id
   * @throws FetchError<400, types.GetApplicationReservationResponse400> Bad request
   * @throws FetchError<401, types.GetApplicationReservationResponse401> Not authorized
   * @throws FetchError<429, types.GetApplicationReservationResponse429> Too many requests
   */
  getApplicationReservation(metadata: types.GetApplicationReservationMetadataParam): Promise<FetchResponse<200, types.GetApplicationReservationResponse200>> {
    return this.core.fetch('/api/reservations/{reservationId}', 'get', metadata);
  }

  /**
   * Create a reservation quote to hold booking offer for certain period of time. A
   * “default”/”standard” rate plan is supplied for properties that aren’t assigned to an
   * active [Revenue Management Rate
   * Plan](https://help.guesty.com/hc/en-gb/articles/9364117776541-Rate-plans-Overview).
   * Ensure you only use the rate plans supplied with the quote to create your reservation.
   *
   * @summary Create a reservation quote
   * @throws FetchError<400, types.CreateReservationQuoteResponse400> Bad request
   * @throws FetchError<401, types.CreateReservationQuoteResponse401> Not authorized
   * @throws FetchError<403, types.CreateReservationQuoteResponse403> Forbidden
   * @throws FetchError<429, types.CreateReservationQuoteResponse429> Too many requests
   */
  createReservationQuote(body: types.CreateReservationQuoteBodyParam): Promise<FetchResponse<200, types.CreateReservationQuoteResponse200>> {
    return this.core.fetch('/api/reservations/quotes', 'post', body);
  }

  /**
   * Retrieve a quote by ID.
   *
   * @summary Retrieve a quote
   * @throws FetchError<400, types.RetrieveQuoteByIdResponse400> Bad request
   * @throws FetchError<401, types.RetrieveQuoteByIdResponse401> Not authorized
   * @throws FetchError<403, types.RetrieveQuoteByIdResponse403> Forbidden
   * @throws FetchError<429, types.RetrieveQuoteByIdResponse429> Too many requests
   */
  retrieveQuoteById(metadata: types.RetrieveQuoteByIdMetadataParam): Promise<FetchResponse<200, types.RetrieveQuoteByIdResponse200>> {
    return this.core.fetch('/api/reservations/quotes/{quoteId}', 'get', metadata);
  }

  /**
   * Ability to add/remove a coupon from existing quote.
   *
   * @summary Update coupon in a quote
   * @throws FetchError<400, types.ManageRatePlanQuoteCouponsResponse400> Bad request
   * @throws FetchError<401, types.ManageRatePlanQuoteCouponsResponse401> Not authorized
   * @throws FetchError<403, types.ManageRatePlanQuoteCouponsResponse403> Forbidden
   * @throws FetchError<429, types.ManageRatePlanQuoteCouponsResponse429> Too many requests
   */
  manageRatePlanQuoteCoupons(body: types.ManageRatePlanQuoteCouponsBodyParam, metadata: types.ManageRatePlanQuoteCouponsMetadataParam): Promise<FetchResponse<number, unknown>>;
  manageRatePlanQuoteCoupons(metadata: types.ManageRatePlanQuoteCouponsMetadataParam): Promise<FetchResponse<number, unknown>>;
  manageRatePlanQuoteCoupons(body?: types.ManageRatePlanQuoteCouponsBodyParam | types.ManageRatePlanQuoteCouponsMetadataParam, metadata?: types.ManageRatePlanQuoteCouponsMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/api/reservations/quotes/{quoteId}/coupons', 'post', body, metadata);
  }

  /**
   * Create instant reservation based on quote to use the same data which the quote holds.
   * Pre-SCA Stripe tokens (starting with `tok_...`) are NOT SUPPORTED. The API supports only
   * Stripe SCA tokens (starting with `pm_...`)
   *
   * @summary Create instant reservation based on quote
   * @throws FetchError<400, types.CreateInstantReservationFromQuoteResponse400> Bad request
   * @throws FetchError<401, types.CreateInstantReservationFromQuoteResponse401> Not authorized
   * @throws FetchError<403, types.CreateInstantReservationFromQuoteResponse403> Forbidden
   * @throws FetchError<429, types.CreateInstantReservationFromQuoteResponse429> Too many requests
   */
  createInstantReservationFromQuote(body: types.CreateInstantReservationFromQuoteBodyParam, metadata: types.CreateInstantReservationFromQuoteMetadataParam): Promise<FetchResponse<200, types.CreateInstantReservationFromQuoteResponse200>> {
    return this.core.fetch('/api/reservations/quotes/{quoteId}/instant', 'post', body, metadata);
  }

  /**
   * Create a request for a reservation to be confirmed by the Guesty user based on a quote.
   * Pre-SCA Stripe tokens (starting with `tok_...`) are NOT SUPPORTED. The API supports only
   * Stripe SCA tokens (starting with `pm_...`)
   *
   * @summary Create inquiry for reservation based on quote
   * @throws FetchError<400, types.CreateInquiryReservationFromQuoteResponse400> Bad request
   * @throws FetchError<401, types.CreateInquiryReservationFromQuoteResponse401> Not authorized
   * @throws FetchError<403, types.CreateInquiryReservationFromQuoteResponse403> Forbidden
   * @throws FetchError<429, types.CreateInquiryReservationFromQuoteResponse429> Too many requests
   */
  createInquiryReservationFromQuote(body: types.CreateInquiryReservationFromQuoteBodyParam, metadata: types.CreateInquiryReservationFromQuoteMetadataParam): Promise<FetchResponse<200, types.CreateInquiryReservationFromQuoteResponse200>> {
    return this.core.fetch('/api/reservations/quotes/{quoteId}/inquiry', 'post', body, metadata);
  }

  /**
   * Retrieve a reservation created with quote by ID
   *
   * @summary Retrieve a reservation by ID
   * @throws FetchError<400, types.GetQuoteReservationByIdResponse400> Bad request
   * @throws FetchError<401, types.GetQuoteReservationByIdResponse401> Not authorized
   * @throws FetchError<403, types.GetQuoteReservationByIdResponse403> Forbidden
   * @throws FetchError<429, types.GetQuoteReservationByIdResponse429> Too many requests
   */
  getQuoteReservationById(metadata: types.GetQuoteReservationByIdMetadataParam): Promise<FetchResponse<200, types.GetQuoteReservationByIdResponse200>> {
    return this.core.fetch('/api/reservations/{reservationId}/details', 'get', metadata);
  }

  /**
   * Get reviews list by parameters
   *
   * @summary Retrieve reviews
   * @throws FetchError<400, types.GetReviewsListResponse400> Bad request
   * @throws FetchError<401, types.GetReviewsListResponse401> Not authorized
   * @throws FetchError<403, types.GetReviewsListResponse403> Forbidden
   * @throws FetchError<429, types.GetReviewsListResponse429> Too many requests
   */
  getReviewsList(metadata?: types.GetReviewsListMetadataParam): Promise<FetchResponse<200, types.GetReviewsListResponse200>> {
    return this.core.fetch('/api/reviews', 'get', metadata);
  }

  /**
   * Upsert metasearch config
   *
   * @summary Upsert metasearch config
   * @throws FetchError<400, types.UpsertMetasearchConfigResponse400> Bad request
   * @throws FetchError<401, types.UpsertMetasearchConfigResponse401> Not authorized
   * @throws FetchError<429, types.UpsertMetasearchConfigResponse429> Too many requests
   */
  upsertMetasearchConfig(body: types.UpsertMetasearchConfigBodyParam, metadata: types.UpsertMetasearchConfigMetadataParam): Promise<FetchResponse<200, types.UpsertMetasearchConfigResponse200>> {
    return this.core.fetch('/api/metasearch/pointofsale/{pointofsale}/config', 'put', body, metadata);
  }

  /**
   * Get metasearch config
   *
   * @summary Get metasearch config
   * @throws FetchError<400, types.GetMetasearchConfigResponse400> Bad request
   * @throws FetchError<401, types.GetMetasearchConfigResponse401> Not authorized
   * @throws FetchError<429, types.GetMetasearchConfigResponse429> Too many requests
   */
  getMetasearchConfig(metadata: types.GetMetasearchConfigMetadataParam): Promise<FetchResponse<200, types.GetMetasearchConfigResponse200>> {
    return this.core.fetch('/api/metasearch/pointofsale/{pointofsale}/config', 'get', metadata);
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { CalculateReservationMoneyMetadataParam, CalculateReservationMoneyResponse200, CalculateReservationMoneyResponse400, CalculateReservationMoneyResponse401, CalculateReservationMoneyResponse403, CalculateReservationMoneyResponse429, CreateInquiryReservationFromQuoteBodyParam, CreateInquiryReservationFromQuoteMetadataParam, CreateInquiryReservationFromQuoteResponse200, CreateInquiryReservationFromQuoteResponse400, CreateInquiryReservationFromQuoteResponse401, CreateInquiryReservationFromQuoteResponse403, CreateInquiryReservationFromQuoteResponse429, CreateInstantReservationFromQuoteBodyParam, CreateInstantReservationFromQuoteMetadataParam, CreateInstantReservationFromQuoteResponse200, CreateInstantReservationFromQuoteResponse400, CreateInstantReservationFromQuoteResponse401, CreateInstantReservationFromQuoteResponse403, CreateInstantReservationFromQuoteResponse429, CreateRerservationBodyParam, CreateRerservationResponse200, CreateRerservationResponse400, CreateRerservationResponse401, CreateRerservationResponse403, CreateRerservationResponse429, CreateReservationQuoteBodyParam, CreateReservationQuoteResponse200, CreateReservationQuoteResponse400, CreateReservationQuoteResponse401, CreateReservationQuoteResponse403, CreateReservationQuoteResponse429, GetApplicationListingMetadataParam, GetApplicationListingResponse200, GetApplicationListingResponse400, GetApplicationListingResponse401, GetApplicationListingResponse403, GetApplicationListingResponse429, GetApplicationListingsListMetadataParam, GetApplicationListingsListResponse200, GetApplicationListingsListResponse400, GetApplicationListingsListResponse401, GetApplicationListingsListResponse429, GetApplicationReservationMetadataParam, GetApplicationReservationResponse200, GetApplicationReservationResponse400, GetApplicationReservationResponse401, GetApplicationReservationResponse429, GetAvailableListingsMetadataParam, GetAvailableListingsResponse200, GetAvailableListingsResponse400, GetAvailableListingsResponse401, GetAvailableListingsResponse429, GetCalendarByListingIdMetadataParam, GetCalendarByListingIdResponse200, GetCalendarByListingIdResponse400, GetCalendarByListingIdResponse401, GetCalendarByListingIdResponse403, GetCalendarByListingIdResponse429, GetCitiesMetadataParam, GetCitiesResponse200, GetCitiesResponse400, GetCitiesResponse401, GetCitiesResponse429, GetMetasearchConfigMetadataParam, GetMetasearchConfigResponse200, GetMetasearchConfigResponse400, GetMetasearchConfigResponse401, GetMetasearchConfigResponse429, GetPaymentProviderByListingIdMetadataParam, GetPaymentProviderByListingIdResponse200, GetPaymentProviderByListingIdResponse400, GetPaymentProviderByListingIdResponse401, GetPaymentProviderByListingIdResponse403, GetPaymentProviderByListingIdResponse429, GetQuoteReservationByIdMetadataParam, GetQuoteReservationByIdResponse200, GetQuoteReservationByIdResponse400, GetQuoteReservationByIdResponse401, GetQuoteReservationByIdResponse403, GetQuoteReservationByIdResponse429, GetReviewsListMetadataParam, GetReviewsListResponse200, GetReviewsListResponse400, GetReviewsListResponse401, GetReviewsListResponse403, GetReviewsListResponse429, ManageRatePlanQuoteCouponsBodyParam, ManageRatePlanQuoteCouponsMetadataParam, ManageRatePlanQuoteCouponsResponse400, ManageRatePlanQuoteCouponsResponse401, ManageRatePlanQuoteCouponsResponse403, ManageRatePlanQuoteCouponsResponse429, RetrieveQuoteByIdMetadataParam, RetrieveQuoteByIdResponse200, RetrieveQuoteByIdResponse400, RetrieveQuoteByIdResponse401, RetrieveQuoteByIdResponse403, RetrieveQuoteByIdResponse429, UpsertMetasearchConfigBodyParam, UpsertMetasearchConfigMetadataParam, UpsertMetasearchConfigResponse200, UpsertMetasearchConfigResponse400, UpsertMetasearchConfigResponse401, UpsertMetasearchConfigResponse429 } from './types';
