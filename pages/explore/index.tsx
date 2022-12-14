import {NextPage} from "next";
import {AppLayout} from "../../src/modules/layout/AppLayout";
import {Box} from "@chakra-ui/react";
import {Pagination} from "../../src/modules/paging/Pagination";
import {InfiniteScroll} from "../../src/modules/paging/InfiniteScroll";

const ExplorePage: NextPage = () => {
    return(
        <AppLayout sidebarWidth={'16rem'}>
            <Box>
                <Box>
                    <InfiniteScroll/>
                    {/*<Pagination/>*/}
                </Box>
            </Box>
        </AppLayout>
    );
}
export default ExplorePage;
