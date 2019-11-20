kubectl config set-credentials default-admin --username=admin --password=6666o9oIB2gHD88882quIfLMy6666
kubectl config set-cluster default-cluster --server=https://cls-66668888.ccs.tencent-cloud.com --certificate-authority=/etc/kubernetes/cluster-ca.crt
kubectl config set-context default-system --cluster=default-cluster --user=default-admin
kubectl config use-context default-system