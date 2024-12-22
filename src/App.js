import React, { useState } from "react";
import { Layout, Form, Input, Button, Table, Typography, Alert, Spin, List } from "antd";

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const [directory, setDirectory] = useState("D:\\desktop\\TEST");
  const [excludeExtensions, setExcludeExtensions] = useState("");
  const [excludeDirectories, setExcludeDirectories] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const queryParams = new URLSearchParams({
        directory,
        excludeExtensions,
        excludeDirectories,
      }).toString();

      const response = await fetch(`http://localhost:8080/api/files/scan?${queryParams}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "File Path",
      dataIndex: "path",
      key: "path",
    },
    {
      title: "Chinese Content",
      dataIndex: "content",
      key: "content",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "#f4f7fa" }}>
      <Header style={{ background: "#1A202C", color: "white", textAlign: "center" }}>
        <Title level={2} style={{ color: "white", margin: 0 }}>
          File Scanner
        </Title>
      </Header>
      <Content style={{ padding: "20px" }}>
        <Form
          layout="vertical"
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            background: "#ffffff",
            padding: "40px 40px 20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Form.Item label="Directory Path">
            <Input
              value={directory}
              onChange={(e) => setDirectory(e.target.value)}
              placeholder="Enter directory path"
              style={{
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            />
          </Form.Item>
          <Form.Item label="Exclude Extensions">
            <Input
              value={excludeExtensions}
              onChange={(e) => setExcludeExtensions(e.target.value)}
              placeholder="e.g., txt, jpg, png"
              style={{
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            />
          </Form.Item>
          <Form.Item label="Exclude Directories">
            <Input
              value={excludeDirectories}
              onChange={(e) => setExcludeDirectories(e.target.value)}
              placeholder="e.g., D:\desktop\TEST"
              style={{
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              onClick={handleScan}
              loading={loading}
              block
              style={{
                borderRadius: "8px",
                background: "#1A73E8",
                borderColor: "#1A73E8",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              {loading ? "Scanning..." : "Scan"}
            </Button>
          </Form.Item>
        </Form>

        {error && (
          <Alert message="Error" description={error} type="error" showIcon style={{ marginTop: "20px" }} />
        )}

        {loading && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Spin size="large" />
          </div>
        )}

        {results && (
          <div style={{ marginTop: "30px" }}>
            <Title level={5}>Files/Directories with Chinese Names</Title>
            <List
              bordered
              dataSource={results.chineseNames}
              renderItem={(name, index) => (
                <List.Item key={index}>
                  <Typography.Text>{name}</Typography.Text>
                </List.Item>
              )}
              style={{ marginTop: "20px" }}
            />
            
            <Title level={5} style={{ marginTop: "20px" }}>Files with Chinese Content</Title>
            <Table
              dataSource={Object.entries(results.filesWithChinese).map(([path, content]) => ({
                key: path,
                path,
                content,
              }))}
              columns={columns}
              pagination={false}
              style={{ marginTop: "20px" }}
            />

            {results.errors.length > 0 && (
              <>
                <Title level={5} style={{ marginTop: "20px" }}>
                  Errors
                </Title>
                <ul>
                  {results.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </Content>
    </Layout>
  );
}

export default App;
