# burlock-web

The part that serves the pages

## Pipeline

`development --> staging --> master`

On the `development` branch, `BURLOCK_API_URL` specified in `.env`.

On the `staging` branch, `BURLOCK_API_URL` points to `https://api-staging.burlockorders.com`.

On the `master` branch, `BURLOCK_API_URL` points to `https://api.burlockorders.com`.

## Building

**Build everything:** `npm i`

Build and run tests: `nodemon --exec 'npm test -- --bail' -e jsx`

Run development server: `npm run dev`

## Component Hierarchy

-   Provider (for Redux)
    -   MainRouter
        -   Main
            -   App
                -   Orders (list of all orders in a bar)
                    -   OrderListItem (multiple)
                        -   ProductOrderSummaryItem (multiple)
                -   Order (individual order, sent or unsent)
                    -   _if Order is sent:_
                        -   SentOrderContents
                        -   SentOrderMessages
                    -   _if Order is unsent:_
                        -   OrderNav
                            -   (searching)(not a separate component)
                            -   ShoppingCart
                        -   ProductList (multiple)
                            -   ProductCard (multiple)
                                -   DistributorField
                                    -   _if there's a distributor for the product:_
                                        -   DistributorName
                                        -   ChangeDistributorModal
                                            -   DistributorSelect
                                    -   _if there's no distributor for the product:_
                                        -   AddDistributorModal
                                            -   DistributorSelect
                                -   RepField
                                    -   DistributorName
                                    -   _if there's a rep on the account:_
                                        -   AddRepModal
                                            -   DistributorName
                                    -   _if there's no rep on the account:_
                                        -   DistributorName
                                        -   AddRepModal
                                            -   DistributorName
                                -   SizeList
                                    -   QuantityInputWithSize (multiple)
                                    -   NewSizeForm
                                        -   AddNewSizeModal
                                            -   ContainerSelect
                                            -   PackagingSelect
                        -   OrderNavBottom (button to create new product)
                        -   NewProductModal
            -   Account
