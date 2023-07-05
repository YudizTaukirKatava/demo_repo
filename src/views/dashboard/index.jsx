import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Cards from "shared/components/Card";
import {
  faBullseye,
  faCartShopping,
  faDatabase,
} from "@fortawesome/free-solid-svg-icons";

function Dashboard() {
  const [allStatistics, setAllStatistics] = useState({});

  const data = [
    {
      title: `${allStatistics?.admins?.toString() || "-"}`,
      subtitle: "Total Registered Admin",
      icon: faDatabase,
    },
    {
      title: `${allStatistics?.teachers?.toString() || "-"}`,
      subtitle: "Total Registered Teacher",
      icon: faBullseye,
    },
    {
      title: `${allStatistics?.students?.toString() || "-"}`,
      subtitle: "Total Registered Students",
      icon: faCartShopping,
    },
    {
      title: `${allStatistics?.students?.toString() || "-"}`,
      subtitle: "Total Registered Students",
      icon: faCartShopping,
    },
  ];

  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  return (
    <div>
      <Row>
        {data?.map((value, i) => {
          return (
            <Col
              xxl={3}
              lg={3}
              sm={6}
              md={6}
              className="pb-3 pb-lg-0 card-box"
              key={i}
            >
              <Cards
                cardtitle={value?.subtitle}
                cardtext={value?.title}
                cardIcon={value?.icon}
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default Dashboard;
