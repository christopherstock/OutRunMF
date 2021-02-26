
    import * as outrun from '..';

    /** ****************************************************************************************************************
    *   The Project class.
    *******************************************************************************************************************/
    export class Project
    {
    }

    export class Point {
        public x :number;
        public y :number;
    }

    export class Route {
    }

    export enum TransportType {
        PRIVATE_VEHICLE,
        BICYCLE,
        PUBLIC_TRANSPORT,
    }

    // TODO to kotlin code !!

    export class Navigator1
    {
        public buildRoute(A: Point, B: Point): Route
        {
            const route: Route = new Route();

            // many lines of code + API invocations
            // ...

            return route;
        }
    }

    export class Navigator2
    {
        public buildRoute(type: TransportType, A: Point, B: Point): Route
        {
            switch ( type )
            {
                case TransportType.PRIVATE_VEHICLE:
                {
                    const route: Route = new Route();

                    // many lines of code + API invocations
                    // ...

                    return route;
                }

                case TransportType.BICYCLE:
                {
                    const route: Route = new Route();

                    // many lines of code + API invocations
                    // ...

                    return route;
                }

                case TransportType.PUBLIC_TRANSPORT:
                {
                    const route: Route = new Route();

                    // many lines of code + API invocations
                    // ...

                    return route;
                }
            }
        }
    }

    export class Navigator3
    {
        public buildRoute(type: TransportType, A: Point, B: Point): Route
        {
            switch ( type )
            {
                case TransportType.PRIVATE_VEHICLE:
                {
                    return this.buildRoutePrivateVehicle(A, B);
                }

                case TransportType.BICYCLE:
                {
                    return this.buildRouteBicycle(A, B);
                }

                case TransportType.PUBLIC_TRANSPORT:
                {
                    return this.buildRoutePublicTransport(A, B);
                }
            }
        }

        private buildRoutePrivateVehicle(A: Point, B: Point): Route
        {
            const route: Route = new Route();

            // many lines of code + API invocations
            // ...

            return route;
        }

        private buildRouteBicycle(A: Point, B: Point): Route
        {
            const route: Route = new Route();

            // many lines of code + API invocations
            // ...

            return route;
        }

        private buildRoutePublicTransport(A: Point, B: Point): Route
        {
            const route: Route = new Route();

            // many lines of code + API invocations
            // ...

            return route;
        }
    }

    // ### Strategy Pattern ###

    export interface RouteStrategy
    {
        buildRoute(A: Point, B: Point): Route;
    }

    export class RouteStrategyPrivateVehicle implements RouteStrategy
    {
        public buildRoute(A: Point, B: Point): Route
        {
            const route: Route = new Route();

            // many lines of code + API invocations
            // ...

            return route;
        }
    }

    export class RouteStrategyBicycle implements RouteStrategy
    {
        public buildRoute(A: Point, B: Point): Route
        {
            const route: Route = new Route();

            // many lines of code + API invocations
            // ...

            return route;
        }
    }

    export class RouteStrategyPublicTransport implements RouteStrategy
    {
        public buildRoute(A: Point, B: Point): Route
        {
            const route: Route = new Route();

            // many lines of code + API invocations
            // ...

            return route;
        }
    }

    export class Navigator4
    {
        public buildRoute(type: TransportType, A: Point, B: Point): Route {

            let strategy :RouteStrategy = null;

            switch ( type )
            {
                case TransportType.PRIVATE_VEHICLE:
                {
                    strategy = new RouteStrategyPrivateVehicle();
                    break;
                }

                case TransportType.BICYCLE:
                {
                    strategy = new RouteStrategyBicycle();
                    break;
                }

                case TransportType.PUBLIC_TRANSPORT:
                default:
                {
                    strategy = new RouteStrategyPublicTransport();
                    break;
                }
            }

            return strategy.buildRoute(A, B);
        }
    }
