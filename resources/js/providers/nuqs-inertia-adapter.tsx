import { router } from "@inertiajs/core";
import { startTransition, useCallback, useEffect, useState } from "react";
import mitt, { Emitter } from "mitt";
import {
    renderQueryString,
    unstable_AdapterInterface,
    unstable_AdapterOptions,
    unstable_createAdapterProvider,
} from "nuqs/adapters/custom";

export type SearchParamsSyncEmitter = Emitter<{ update: URLSearchParams }>;

const emitter: SearchParamsSyncEmitter = mitt();

function useNuqsInertiaAdapter(): unstable_AdapterInterface {
    const [searchParams, setSearchParams] = useState(() => {
        if (typeof location === "undefined") {
            return new URLSearchParams();
        }
        return new URLSearchParams(location.search);
    });

    const updateUrl = useCallback(
        (
            search: URLSearchParams,
            options: Required<unstable_AdapterOptions>
        ) => {
            startTransition(() => {
                const url = new URL(location.href);
                url.search = renderQueryString(search);

                emitter.emit("update", search);

                if (!options.shallow) {
                    const visitOptions = {
                        preserveScroll: !options.scroll,
                        preserveState: true,
                        replace: options.history === "replace",
                    };

                    router.visit(url.pathname + url.search, visitOptions);
                }
            });
        },
        []
    );

    useEffect(() => {
        function onPopState() {
            setSearchParams(new URLSearchParams(location.search));
        }

        function onEmitterUpdate(search: URLSearchParams) {
            setSearchParams(search);
        }

        emitter.on("update", onEmitterUpdate);
        window.addEventListener("popstate", onPopState);

        return () => {
            emitter.off("update", onEmitterUpdate);
            window.removeEventListener("popstate", onPopState);
        };
    }, []);

    return {
        searchParams,
        updateUrl,
        rateLimitFactor: 1,
    };
}

export const NuqsAdapter = unstable_createAdapterProvider(
    useNuqsInertiaAdapter
);

// /**
// I haven't tested this
// export function enableHistorySync() {
//   patchHistory(emitter, 'inertia');
// }
