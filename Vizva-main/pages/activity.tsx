import styled from "@emotion/styled";
import { Tab } from "@headlessui/react";
import HistoryItem from "components/history/historyItem";
import Navbar from "components/navigation/navbar";
import Prompt from "components/prompt";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import { NOTIFICATION_TYPE } from "components/history/history.type";
import MaxWidth from "components/layout/maxWidth";
import { breakpoint } from "public/breakpoint";
import Head from "next/head";

export interface Activity {
  description: string;
  notifyUser: boolean;
  category: string;
  type: string;
  createdAt: string;
  read: boolean;
  updatedAt: string;
  objectId: string;
}

export default function Activity() {
  const { isAuthenticated, Moralis } = useMoralis();
  const { data, isLoading, error } = useMoralisCloudFunction("getUserActivity");

  return (
    <>
      <Head>
        <title>Activity</title>
      </Head>
      <Navbar />
      <MaxWidth>
        {!isAuthenticated ? (
          <Prompt
            message="connect your wallet to view notifications"
            closeable={false}
            title="connect wallet"
            text="connect wallet"
            href="/connectwallet"
          />
        ) : (
          <StyledDiv>
            <Tab.Group>
              <Tab.List className="tab-list">
                <Tab
                  className={({ selected }: { selected: boolean }) =>
                    selected ? "active" : ""
                  }
                >
                  Activity
                </Tab>
                <Tab
                  className={({ selected }: { selected: boolean }) =>
                    selected ? "active" : ""
                  }
                >
                  Notifications
                </Tab>
              </Tab.List>
              <Tab.Panels className="tab-panels">
                <>
                  {data && (
                    <Tab.Panel className="tab-panel">
                      <table>
                        <tbody>
                          {(
                            JSON.parse(
                              JSON.stringify(data)
                            ) as NOTIFICATION_TYPE[]
                          )
                            .filter((activity) => !activity.notifyUser)
                            .map((data, index) => (
                              <HistoryItem
                                data={data}
                                key={`history-${index}`}
                              />
                            ))}
                        </tbody>
                      </table>
                    </Tab.Panel>
                  )}
                  {data && (
                    <Tab.Panel className="tab-panel">
                      <table>
                        <tbody>
                          {(
                            JSON.parse(
                              JSON.stringify(data)
                            ) as NOTIFICATION_TYPE[]
                          )
                            .filter((activity) => activity.notifyUser)
                            .map((data, index) => (
                              <HistoryItem
                                data={data}
                                key={`history-${index}`}
                              />
                            ))}
                        </tbody>
                      </table>
                    </Tab.Panel>
                  )}
                </>
              </Tab.Panels>
            </Tab.Group>
          </StyledDiv>
        )}
      </MaxWidth>
    </>
  );
}

const StyledDiv = styled.div`
  max-height: calc(100vh - 110px);
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: max-content 1fr;

  .tab-list {
    display: flex;
    justify-content: center;
    margin: var(--padding-7) auto var(--padding-7) auto;

    button {
      outline: none;
      border: none;
      font-size: var(--fontsizes-1);
      background: transparent;
      color: ${(props) => props.theme.gray3};
      font-weight: 500;
      border-bottom: 2px solid transparent;
      padding-bottom: var(--padding-1);
      min-width: 150px;
      cursor: pointer;
      &:first-of-type {
        margin-right: var(--padding-5);
      }
      &.active {
        color: ${(props) => props.theme.primary};
        border-color: ${(props) => props.theme.primary};
      }
      &:hover,
      &:focus {
        color: ${(props) => props.theme.primary};
      }
    }
  }

  .tab-panels {
    width: 100%;
    overflow: auto;
    table {
      tbody {
        display: block;
      }
      display: block;
      width: 100%;
    }

    .tab-panel {
      max-width: 800px;
      margin: 0 auto;
    }
  }

  ${breakpoint("lg")} {
    .tab-list > button {
      font-size: var(--fontsizes-2);
    }
  }
`;
